// src/components/now/blocks/ImageBlock.tsx
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
    <figure className="my-8">
      <Image
        src={url}
        alt={alt ?? ""}
        width={1440}
        height={900}
        sizes="(max-width: 768px) 100vw, 720px"
        unoptimized
        className="w-full h-auto border border-[color:var(--now-line)] rounded"
      />
      {caption ? (
        <figcaption className="mt-2 font-[var(--font-mono)] text-[11px] text-[color:var(--now-dim)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
