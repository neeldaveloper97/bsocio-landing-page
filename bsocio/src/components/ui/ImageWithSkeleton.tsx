"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
  objectPosition?: "top" | "center" | "bottom";
}

/**
 * Image component with skeleton loading
 * Shows a skeleton placeholder until the image is fully loaded
 * Image automatically fills and adapts to container size
 */
export function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  fill = true,
  priority = false,
  quality = 85,
  sizes = "100vw",
  className,
  containerClassName,
  aspectRatio,
  objectFit = "cover",
  objectPosition = "center",
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  }[objectFit];

  const objectPositionClass = {
    top: "object-top",
    center: "object-center",
    bottom: "object-bottom",
  }[objectPosition];

  return (
    <div
      className={cn("relative overflow-hidden", containerClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton - hidden when image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 bg-gray-200">
          <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-gray-200 via-gray-100 to-gray-200" />
        </div>
      )}

      {/* Image - fills container */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          objectFitClass,
          objectPositionClass,
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
}

export default ImageWithSkeleton;
