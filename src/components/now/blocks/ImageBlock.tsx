import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

type Props = {
  asset: { _ref: string };
  alt?: string;
  caption?: string;
};

export function ImageBlock({ asset, alt, caption }: Props) {
  const url = urlFor(asset).width(1440).auto("format").quality(75).url();
  return (
    <figure className="now-block-image">
      <Image
        src={url}
        alt={alt ?? ""}
        width={1440}
        height={900}
        sizes="(max-width: 768px) 100vw, 720px"
        unoptimized
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
