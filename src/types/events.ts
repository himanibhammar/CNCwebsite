export interface ImageLayout {
  /** Offset percentage along X-axis relative to gallery viewport */
  x: number;
  /** Offset percentage along Y-axis relative to gallery viewport */
  y: number;
  /** Width percentage relative to gallery viewport */
  width: number;
  /** Optional slight rotation angle (degrees) */
  rotation?: number;
  /** Layer stacking index */
  zIndex?: number;
}

export interface FlagshipImage {
  src: string;
  alt: string;
  caption?: string;
  layout: ImageLayout;
}

export interface FlagshipEvent {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  images: FlagshipImage[];
  year?: string;
  highlights?: string[];
  schedule?: { phase: string; time: string }[];
}

export interface PastEvent {
  id: string;
  title: string;
  year: string;
  category: string;
  image: string;
  description: string;
  teamSize?: string;
  status: "Completed" | "Annual" | "Upcoming";
}
