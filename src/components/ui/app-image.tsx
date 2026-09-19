import Image, { type ImageProps } from "next/image";

export type AppImageProps = ImageProps;

export function AppImage({ src, alt = "", unoptimized, ...props }: AppImageProps) {
  const isSvg =
    typeof src === "string"
      ? src.toLowerCase().split("?")[0].endsWith(".svg")
      : typeof src === "object" && src !== null && "src" in src && typeof (src as { src: string }).src === "string"
      ? (src as { src: string }).src.toLowerCase().split("?")[0].endsWith(".svg")
      : false;

  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={unoptimized ?? (isSvg ? true : undefined)}
      {...props}
    />
  );
}

export default AppImage;
