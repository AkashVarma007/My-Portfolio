// src/app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export const runtime = "nodejs";

type SanityPayload = {
  _type?: string;
  slug?: { current?: string };
  slugCurrent?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<SanityPayload>(
      req,
      process.env.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "No _type in body" }, { status: 400 });
    }

    revalidateTag("logs", "max");
    revalidatePath("/now");

    const slug = body.slug?.current ?? body.slugCurrent;
    if (slug) {
      revalidatePath(`/now/${slug}`);
      revalidateTag(`log:${slug}`, "max");
    }

    return NextResponse.json({ revalidated: true, slug: slug ?? null });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
