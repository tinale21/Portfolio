import Image from "next/image";
import { CollagePhotoConfig } from "./collage-layout";

export function CollagePhoto({
  src,
  alt,
  top,
  left,
  width,
  height,
  rotate,
  z,
  priority,
}: CollagePhotoConfig) {
  return (
    <div
      className="absolute overflow-hidden rounded-[10px]"
      style={{
        top,
        left,
        width,
        height,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        zIndex: z,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 30vw, 45vw"
        className="object-cover"
        placeholder="blur"
        priority={priority}
      />
    </div>
  );
}
