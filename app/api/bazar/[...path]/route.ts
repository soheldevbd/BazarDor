import { NextRequest, NextResponse } from "next/server";

// Server-side proxy: avoids CORS problems and falls back to the alternative API.
const BASES = [
  process.env.BAZAR_API_1 ?? "https://api.api-store.workers.dev/api/bazardor",
  process.env.BAZAR_API_2 ?? "https://api.abcz.workers.dev/api/bazardor",
];

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const target = `${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}/${target}`, { next: { revalidate: 60 } });
      if (res.status === 404) return NextResponse.json({ error: "not found" }, { status: 404 });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      /* try next base */
    }
  }
  return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
}
