import type { Change, Product } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/bazar${path}`);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

const toArray = (d: any): any[] =>
  Array.isArray(d) ? d : (d?.data ?? d?.items ?? d?.products ?? []);

export function normalize(p: any): Product {
  const today = Number(p.today) || 0;
  const yesterday = Number(p.yesterday) || 0;
  let change: Change | undefined = p.change;
  if (!change || typeof change.pct !== "number") {
    const pct = yesterday ? ((today - yesterday) / yesterday) * 100 : 0;
    change = {
      dir: pct > 0.049 ? "up" : pct < -0.049 ? "down" : "flat",
      pct: Math.round(Math.abs(pct) * 10) / 10,
    };
  }
  const dir = change.dir === "up" || change.dir === "down" ? change.dir : "flat";
  return {
    id: p.id,
    slug: p.slug,
    nameBn: p.nameBn,
    category: p.category,
    categoryNameBn: p.categoryNameBn,
    categoryIcon: p.categoryIcon,
    unit: p.unit,
    image: p.image || p.categoryIcon || "🛒",
    today,
    yesterday,
    lastWeek: Number(p.lastWeek) || 0,
    lastMonth: Number(p.lastMonth) || 0,
    change: { dir: change.pct === 0 ? "flat" : dir, pct: Number(change.pct) || 0 },
    markets: Array.isArray(p.markets) ? p.markets : [],
  };
}

let productsPromise: Promise<Product[]> | null = null;
export function getProducts(): Promise<Product[]> {
  if (!productsPromise) {
    productsPromise = get<any>("/products")
      .then((d) => toArray(d).map(normalize))
      .catch((e) => {
        productsPromise = null;
        throw e;
      });
  }
  return productsPromise;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  let raw: any;
  try {
    raw = await get<any>(`/products?slug=${encodeURIComponent(slug)}`);
  } catch (e) {
    if ((e as Error).message === "404") return null;
    throw e;
  }
  const found = toArray(raw).find((p) => p.slug === slug);
  if (!found) return null;
  try {
    return normalize(await get<any>(`/products/${found.id}`));
  } catch {
    return normalize(found);
  }
}
