import { NextResponse } from "next/server";
import { getJson } from "serpapi";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "period products";

  try {
    const response = await getJson({
      engine: "google_shopping",
      q: query,
      location: "India",
      hl: "en",
      gl: "in",
      api_key: process.env.SERPAPI_KEY!,
    });

    return NextResponse.json({ products: response.shopping_results || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
