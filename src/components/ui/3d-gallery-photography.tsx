"use client";

/* eslint-disable react-hooks/immutability --
   react-three-fiber drives WebGL by mutating the Three.js object graph from
   outside React: `useFrame` writes shader uniforms and mesh transforms sixty
   times a second, and pointer handlers poke uniforms directly. That is the
   library's supported pattern, and it is the reason this gallery renders once
   instead of re-rendering every frame. The React Compiler immutability rule
   has no model for it, so it is off for this file only. Every other rule,
   including the rest of react-hooks, stays on. */

import type React from "react";
import { Suspense, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * Infinite 3D photography gallery.
 *
 * Planes drift toward the camera through a looping depth range, fading and
 * defocusing at both ends of the tunnel.
 *
 * Adapted from the published component. Geometry, shaders and the fade/blur
 * curves are unchanged. What differs, and why:
 *
 *  1. `"use client"`, which App Router requires for a hooks-and-canvas component.
 *  2. Plane transforms are written straight onto the meshes inside the frame
 *     loop. The original drove them with setState on every frame, which
 *     re-rendered the whole subtree sixty times a second.
 *  3. Scroll velocity, autoplay and hover live in refs and uniforms, same reason.
 *  4. `interactive` (new). When false the gallery never touches wheel, key or
 *     touch events and simply drifts. Needed because the component calls
 *     `preventDefault()` on wheel, which traps the page if it is embedded in a
 *     scrolling layout rather than given a route of its own.
 *  5. Input listeners bind to this instance's own canvas rather than
 *     `document.querySelector("canvas")`, which grabs whichever canvas is first
 *     in the document.
 *  6. `speed` and `visibleCount` are forwarded to the scene. The original
 *     accepted them on the wrapper and never passed them down.
 *  7. Textures are tagged sRGB, otherwise they render several stops dark.
 *  8. Autoplay yields to `prefers-reduced-motion`.
 */

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
	fadeIn: { start: number; end: number };
	fadeOut: { start: number; end: number };
}

interface BlurSettings {
	blurIn: { start: number; end: number };
	blurOut: { start: number; end: number };
	maxBlur: number;
}

interface InfiniteGalleryProps {
	images: ImageItem[];
	speed?: number;
	/**
	 * Accepted for API compatibility. Depth spacing is derived from
	 * DEFAULT_DEPTH_RANGE and the plane count, so these are not read.
	 */
	zSpacing?: number;
	falloff?: { near: number; far: number };
	visibleCount?: number;
	/**
	 * Capture wheel, arrow keys and touch. Defaults to true.
	 *
	 * Set false when the gallery is a backdrop inside a page that scrolls:
	 * input capture calls `preventDefault()` on wheel and would otherwise trap
	 * the reader on the section.
	 */
	interactive?: boolean;
	fadeSettings?: FadeSettings;
	blurSettings?: BlurSettings;
	className?: string;
	style?: React.CSSProperties;
}

interface PlaneData {
	index: number;
	z: number;
	imageIndex: number;
	x: number;
	y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

const createClothMaterial = () => {
	return new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			map: { value: null },
			opacity: { value: 1.0 },
			blurAmount: { value: 0.0 },
			scrollForce: { value: 0.0 },
			time: { value: 0.0 },
			isHovered: { value: 0.0 },
		},
		vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;

        vec3 pos = position;

        // Create smooth curving based on scroll force
        float curveIntensity = scrollForce * 0.3;

        // Base curve across the plane based on distance from center
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        // Add gentle cloth-like ripples
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        // Flag waving effect when hovered
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;

          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }

        pos.z -= (curve + clothEffect + flagWave);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
		fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vec4 color = texture2D(map, vUv);

        // Simple blur approximation
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        // Add subtle lighting effect based on curving
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);

        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
	});
};

/**
 * One plane. Position, scale and texture are written by the frame loop, so
 * this renders once and never again. Hover only pokes a uniform, and the
 * handlers are omitted entirely when the gallery is not interactive, which
 * also keeps R3F from raycasting the scene on every pointer move.
 */
function ImagePlane({
	material,
	registerMesh,
	interactive,
}: {
	material: THREE.ShaderMaterial;
	registerMesh: (mesh: THREE.Mesh | null) => void;
	interactive: boolean;
}) {
	const hoverProps = interactive
		? {
				onPointerEnter: () => {
					material.uniforms.isHovered.value = 1.0;
				},
				onPointerLeave: () => {
					material.uniforms.isHovered.value = 0.0;
				},
			}
		: {};

	return (
		<mesh ref={registerMesh} material={material} {...hoverProps}>
			<planeGeometry args={[1, 1, 32, 32]} />
		</mesh>
	);
}

function GalleryScene({
	images,
	speed = 1,
	visibleCount = 8,
	interactive = true,
	fadeSettings = {
		fadeIn: { start: 0.05, end: 0.15 },
		fadeOut: { start: 0.85, end: 0.95 },
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.1 },
		blurOut: { start: 0.9, end: 1.0 },
		maxBlur: 3.0,
	},
}: Omit<InfiniteGalleryProps, "className" | "style">) {
	const scrollVelocity = useRef(0);
	const autoPlay = useRef(true);
	const lastInteraction = useRef(0);
	const meshes = useRef<(THREE.Mesh | null)[]>([]);
	const canvas = useThree((state) => state.gl.domElement);

	useEffect(() => {
		lastInteraction.current = Date.now();
	}, []);

	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === "string" ? { src: img, alt: "" } : img
			),
		[images]
	);

	const textures = useTexture(normalizedImages.map((img) => img.src));

	// Without this the textures are sampled as linear and read several stops
	// too dark against the renderer's sRGB output.
	useEffect(() => {
		textures.forEach((texture) => {
			texture.colorSpace = THREE.SRGBColorSpace;
			texture.needsUpdate = true;
		});
	}, [textures]);

	const materials = useMemo(
		() => Array.from({ length: visibleCount }, () => createClothMaterial()),
		[visibleCount]
	);

	// Shader materials are not collected with the React tree.
	useEffect(() => {
		return () => materials.forEach((material) => material.dispose());
	}, [materials]);

	const spatialPositions = useMemo(() => {
		const positions: { x: number; y: number }[] = [];

		for (let i = 0; i < visibleCount; i++) {
			// Golden angle spread, so the scatter reads natural rather than ringed
			const horizontalAngle = (i * 2.618) % (Math.PI * 2);
			const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);

			const horizontalRadius = (i % 3) * 1.2;
			const verticalRadius = ((i + 1) % 4) * 0.8;

			positions.push({
				x:
					(Math.sin(horizontalAngle) *
						horizontalRadius *
						MAX_HORIZONTAL_OFFSET) /
					3,
				y: (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET) / 4,
			});
		}

		return positions;
	}, [visibleCount]);

	const totalImages = normalizedImages.length;
	const depthRange = DEFAULT_DEPTH_RANGE;

	// Mutated in place by the frame loop. This is state that deliberately lives
	// outside React; re-deriving it per render would reset the gallery.
	const planes = useMemo<PlaneData[]>(
		() =>
			Array.from({ length: visibleCount }, (_, i) => ({
				index: i,
				z:
					visibleCount > 0
						? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange
						: 0,
				imageIndex: totalImages > 0 ? i % totalImages : 0,
				x: spatialPositions[i]?.x ?? 0,
				y: spatialPositions[i]?.y ?? 0,
			})),
		[depthRange, spatialPositions, totalImages, visibleCount]
	);

	const nudge = useCallback((amount: number) => {
		scrollVelocity.current += amount;
		autoPlay.current = false;
		lastInteraction.current = Date.now();
	}, []);

	const handleWheel = useCallback(
		(event: WheelEvent) => {
			event.preventDefault();
			nudge(event.deltaY * 0.01 * speed);
		},
		[nudge, speed]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
				nudge(-2 * speed);
			} else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
				nudge(2 * speed);
			}
		},
		[nudge, speed]
	);

	// Bound to this gallery's own canvas, and skipped entirely when the gallery
	// is a backdrop, so the host page keeps its own scroll.
	useEffect(() => {
		if (!interactive || !canvas) return;

		let lastTouchY: number | null = null;

		const onTouchStart = (event: TouchEvent) => {
			lastTouchY = event.touches[0]?.clientY ?? null;
		};

		const onTouchMove = (event: TouchEvent) => {
			const y = event.touches[0]?.clientY;
			if (y == null || lastTouchY == null) return;
			nudge((lastTouchY - y) * 0.03 * speed);
			lastTouchY = y;
		};

		canvas.addEventListener("wheel", handleWheel, { passive: false });
		canvas.addEventListener("touchstart", onTouchStart, { passive: true });
		canvas.addEventListener("touchmove", onTouchMove, { passive: true });
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			canvas.removeEventListener("wheel", handleWheel);
			canvas.removeEventListener("touchstart", onTouchStart);
			canvas.removeEventListener("touchmove", onTouchMove);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [interactive, canvas, handleWheel, handleKeyDown, nudge, speed]);

	// Resume drifting once the viewer has been still, unless they asked for
	// reduced motion. A non-interactive gallery simply always drifts.
	useEffect(() => {
		const reduced =
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (reduced) {
			autoPlay.current = false;
			return;
		}

		if (!interactive) {
			autoPlay.current = true;
			return;
		}

		const interval = window.setInterval(() => {
			if (Date.now() - lastInteraction.current > 3000) {
				autoPlay.current = true;
			}
		}, 1000);

		return () => window.clearInterval(interval);
	}, [interactive]);

	useFrame((state, delta) => {
		if (autoPlay.current) {
			scrollVelocity.current += 0.3 * delta;
		}

		scrollVelocity.current *= 0.95;

		const time = state.clock.getElapsedTime();
		const velocity = scrollVelocity.current;

		for (const material of materials) {
			material.uniforms.time.value = time;
			material.uniforms.scrollForce.value = velocity;
		}

		const imageAdvance =
			totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
		const totalRange = depthRange;
		const halfRange = totalRange / 2;

		planes.forEach((plane, i) => {
			let newZ = plane.z + velocity * delta * 10;
			let wrapsForward = 0;
			let wrapsBackward = 0;

			if (newZ >= totalRange) {
				wrapsForward = Math.floor(newZ / totalRange);
				newZ -= totalRange * wrapsForward;
			} else if (newZ < 0) {
				wrapsBackward = Math.ceil(-newZ / totalRange);
				newZ += totalRange * wrapsBackward;
			}

			if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
				plane.imageIndex =
					(plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
			}

			if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
				const step = plane.imageIndex - wrapsBackward * imageAdvance;
				plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
			}

			plane.z = ((newZ % totalRange) + totalRange) % totalRange;
			plane.x = spatialPositions[i]?.x ?? 0;
			plane.y = spatialPositions[i]?.y ?? 0;

			const normalizedPosition = plane.z / totalRange;

			// ---- opacity ----------------------------------------------------
			let opacity = 1;

			if (
				normalizedPosition >= fadeSettings.fadeIn.start &&
				normalizedPosition <= fadeSettings.fadeIn.end
			) {
				opacity =
					(normalizedPosition - fadeSettings.fadeIn.start) /
					(fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
			} else if (normalizedPosition < fadeSettings.fadeIn.start) {
				opacity = 0;
			} else if (
				normalizedPosition >= fadeSettings.fadeOut.start &&
				normalizedPosition <= fadeSettings.fadeOut.end
			) {
				opacity =
					1 -
					(normalizedPosition - fadeSettings.fadeOut.start) /
						(fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
			} else if (normalizedPosition > fadeSettings.fadeOut.end) {
				opacity = 0;
			}

			opacity = Math.max(0, Math.min(1, opacity));

			// ---- defocus ----------------------------------------------------
			let blur = 0;

			if (
				normalizedPosition >= blurSettings.blurIn.start &&
				normalizedPosition <= blurSettings.blurIn.end
			) {
				const blurInProgress =
					(normalizedPosition - blurSettings.blurIn.start) /
					(blurSettings.blurIn.end - blurSettings.blurIn.start);
				blur = blurSettings.maxBlur * (1 - blurInProgress);
			} else if (normalizedPosition < blurSettings.blurIn.start) {
				blur = blurSettings.maxBlur;
			} else if (
				normalizedPosition >= blurSettings.blurOut.start &&
				normalizedPosition <= blurSettings.blurOut.end
			) {
				blur =
					blurSettings.maxBlur *
					((normalizedPosition - blurSettings.blurOut.start) /
						(blurSettings.blurOut.end - blurSettings.blurOut.start));
			} else if (normalizedPosition > blurSettings.blurOut.end) {
				blur = blurSettings.maxBlur;
			}

			blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

			const material = materials[i];
			const mesh = meshes.current[i];
			if (!material || !mesh) return;

			material.uniforms.opacity.value = opacity;
			material.uniforms.blurAmount.value = blur;

			// Swapping the texture here, rather than through a prop, is what lets
			// the whole scene render exactly once.
			const texture = textures[plane.imageIndex];
			if (texture && material.uniforms.map.value !== texture) {
				material.uniforms.map.value = texture;
			}

			mesh.position.set(plane.x, plane.y, plane.z - halfRange);

			const image = texture?.image as
				| { width: number; height: number }
				| undefined;
			const aspect = image ? image.width / image.height : 1;
			if (aspect > 1) {
				mesh.scale.set(2 * aspect, 2, 1);
			} else {
				mesh.scale.set(2, 2 / aspect, 1);
			}
		});
	});

	if (normalizedImages.length === 0) return null;

	return (
		<>
			{planes.map((plane, i) => (
				<ImagePlane
					key={plane.index}
					material={materials[i]}
					interactive={interactive}
					registerMesh={(mesh) => {
						meshes.current[i] = mesh;
					}}
				/>
			))}
		</>
	);
}

/** Shown when the browser cannot give us a WebGL context. */
function FallbackGallery({ images }: { images: ImageItem[] }) {
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === "string" ? { src: img, alt: "" } : img
			),
		[images]
	);

	return (
		<div className="flex h-full w-full items-center justify-center overflow-hidden p-6">
			<div className="grid w-full max-w-5xl grid-cols-2 gap-2 opacity-40 sm:grid-cols-3 md:grid-cols-4">
				{normalizedImages.slice(0, 8).map((img) => (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img
						key={img.src}
						src={img.src}
						alt={img.alt ?? ""}
						className="h-24 w-full rounded-sm object-cover grayscale md:h-32"
					/>
				))}
			</div>
		</div>
	);
}

export default function InfiniteGallery({
	images,
	speed = 1,
	visibleCount = 8,
	interactive = true,
	className = "h-96 w-full",
	style,
	fadeSettings = {
		fadeIn: { start: 0.05, end: 0.25 },
		fadeOut: { start: 0.4, end: 0.43 },
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.1 },
		blurOut: { start: 0.4, end: 0.43 },
		maxBlur: 8.0,
	},
}: InfiniteGalleryProps) {
	const webglSupported = useMemo(() => {
		if (typeof window === "undefined") return true;
		try {
			const probe = document.createElement("canvas");
			return Boolean(
				probe.getContext("webgl2") ||
					probe.getContext("webgl") ||
					probe.getContext("experimental-webgl")
			);
		} catch {
			return false;
		}
	}, []);

	if (!webglSupported) {
		return (
			<div className={className} style={style}>
				<FallbackGallery images={images} />
			</div>
		);
	}

	return (
		<div className={className} style={style}>
			<Canvas
				camera={{ position: [0, 0, 0], fov: 55 }}
				gl={{ antialias: true, alpha: true }}
				dpr={[1, 1.75]}
			>
				<Suspense fallback={null}>
					<GalleryScene
						images={images}
						speed={speed}
						visibleCount={visibleCount}
						interactive={interactive}
						fadeSettings={fadeSettings}
						blurSettings={blurSettings}
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}
