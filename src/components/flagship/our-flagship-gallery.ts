/**
 * Photographs shown in the depth gallery behind the OUR FLAGSHIP transition.
 *
 * ---------------------------------------------------------------------------
 * TO SWAP IN THE REAL SET
 * ---------------------------------------------------------------------------
 * Drop the files into `public/images/our-flagship/` and replace the entries
 * below. Nothing else needs to change: the gallery reads the length of this
 * array, so seven, eight or twenty all work.
 *
 *   { src: "/images/our-flagship/01.jpg", alt: "..." }
 *
 * Notes that will save you a round trip:
 *
 *  - Landscape frames read best. Portraits are scaled to the same height, so
 *    they end up narrow in the tunnel.
 *  - Around 1600px on the long edge is plenty. These load as WebGL textures,
 *    not through next/image, so whatever you put here is what the browser
 *    downloads. Eight untouched camera JPEGs is an easy 40MB.
 *  - `alt` is used by the no-WebGL fallback grid, so it is worth writing.
 *
 * Until then this points at the eight production frames already in the repo.
 * Every `03.jpg` in `public/images/flagships/` is still a development
 * placeholder, so those are deliberately excluded.
 */

export interface GalleryImage {
	src: string;
	alt: string;
}

/**
 * Routes a local image through Next's image optimiser.
 *
 * These load as WebGL textures, which means they bypass `next/image` and the
 * browser downloads whatever the path points at. This section lives on the
 * home page, so a handful of untouched camera JPEGs would land on every first
 * visit. Borrowing the optimiser endpoint gets WebP at a sane width for
 * roughly a fifth of the bytes, with no build step and no extra dependency.
 *
 * `w` must be one of Next's configured device sizes and `q` must be an allowed
 * quality; 1200 and 75 are both defaults. Remote URLs need a matching
 * `images.remotePatterns` entry in next.config.ts, so pass those through
 * untouched.
 */
function optimized(path: string, width = 1200): string {
	if (!path.startsWith("/")) return path;
	return `/_next/image?url=${encodeURIComponent(path)}&w=${width}&q=75`;
}

const SOURCES: GalleryImage[] = [
	{ src: "/images/flagships/hacksummit/1.jpg", alt: "Hack Summit" },
	{ src: "/images/flagships/hacksummit/2.jpg", alt: "Hack Summit" },
	{ src: "/images/flagships/hacksummit/3.jpg", alt: "Hack Summit" },
	{ src: "/images/flagships/hacksummit/4.jpg", alt: "Hack Summit" },
	{ src: "/images/flagships/hacksummit/5.jpg", alt: "Hack Summit" },
	{ src: "/images/flagships/hacksummit/6.jpg", alt: "Hack Summit" },
	{ src: "/images/flagships/hacksummit/7.jpg", alt: "Hack Summit" },
	{ src: "/images/flagships/hacksummit/8.jpg", alt: "Hack Summit" },
	{ src: "/images/flagships/nasa-space-apps/9.jpg", alt: "NASA Space Apps" },
	{ src: "/images/flagships/nasa-space-apps/10.jpg", alt: "NASA Space Apps" },
	{ src: "/images/flagships/nasa-space-apps/11.jpg", alt: "NASA Space Apps" },
	{ src: "/images/flagships/nasa-space-apps/12.jpg", alt: "NASA Space Apps" },
	{ src: "/images/flagships/nasa-space-apps/13.jpg", alt: "NASA Space Apps" },
	{ src: "/images/flagships/nasa-space-apps/14.jpg", alt: "NASA Space Apps" },
	{ src: "/images/flagships/nasa-space-apps/15.jpg", alt: "NASA Space Apps" },
	{ src: "/images/flagships/nasa-space-apps/16.jpg", alt: "NASA Space Apps" },
	{ src: "/images/flagships/turbodrift/17.jpg", alt: "TurboDrift" },
	{ src: "/images/flagships/turbodrift/18.jpg", alt: "TurboDrift" },
	{ src: "/images/flagships/turbodrift/19.jpg", alt: "TurboDrift" },
	{ src: "/images/flagships/turbodrift/20.jpg", alt: "TurboDrift" },
	{ src: "/images/flagships/turbodrift/21.jpg", alt: "TurboDrift" },
	{ src: "/images/flagships/turbodrift/22.jpg", alt: "TurboDrift" },
	{ src: "/images/flagships/turbodrift/23.jpg", alt: "TurboDrift" },
	{ src: "/images/flagships/turbodrift/24.jpg", alt: "TurboDrift" },
	{ src: "/images/flagships/quadcopter/25.jpg", alt: "Quadcopter" },
	{ src: "/images/flagships/quadcopter/26.jpg", alt: "Quadcopter" },
	{ src: "/images/flagships/quadcopter/27.jpg", alt: "Quadcopter" },
	{ src: "/images/flagships/quadcopter/28.jpg", alt: "Quadcopter" },
	{ src: "/images/flagships/quadcopter/29.jpg", alt: "Quadcopter" },
	{ src: "/images/flagships/quadcopter/30.jpg", alt: "Quadcopter" },
	{ src: "/images/flagships/quadcopter/31.jpg", alt: "Quadcopter" },
	{ src: "/images/flagships/quadcopter/32.jpg", alt: "Quadcopter" },
];

export const OUR_FLAGSHIP_GALLERY: GalleryImage[] = SOURCES.map((image) => ({
	...image,
	src: optimized(image.src),
}));
