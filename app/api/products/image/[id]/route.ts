import { getProductImageById } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const image = await getProductImageById(decodeURIComponent(id));

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(image.buffer), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": image.contentType,
    },
  });
}
