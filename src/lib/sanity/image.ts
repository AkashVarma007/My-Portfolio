// src/lib/sanity/image.ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(src: SanityImageSource) {
  return builder.image(src);
}
