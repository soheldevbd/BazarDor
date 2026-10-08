import type { Change } from "./types";

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert any western digits in a string/number into Bengali digits (display only). */
export const toBn = (v: string | number) => String(v).replace(/\d/g, (d) => BN[Number(d)]);

/** 1850 -> ১,৮৫০ ; 148.5 -> ১৪৮.৫ */
export const fmtNum = (n: number) =>
  toBn(n.toLocaleString("en-US", { maximumFractionDigits: 1 }));

export const fmtPrice = (n: number) => `${fmtNum(n)} টাকা`;

export const fmtChange = (c: Change) =>
  c.dir === "up"
    ? `▲ ${toBn(c.pct.toFixed(1))}%`
    : c.dir === "down"
      ? `▼ ${toBn(c.pct.toFixed(1))}%`
      : `— ${toBn("0.0")}%`;

const UNITS: Record<string, string> = {
  kg: "প্রতি কেজি",
  kilogram: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  l: "প্রতি লিটার",
  ltr: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  doz: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
  pc: "প্রতি পিস",
  hali: "প্রতি হালি",
  gram: "প্রতি গ্রাম",
  g: "প্রতি গ্রাম",
};

export function unitBn(unit: string) {
  const u = (unit ?? "").trim();
  if (u.startsWith("প্রতি")) return u;
  const hit = UNITS[u.toLowerCase()];
  if (hit) return hit;
  return u ? `প্রতি ${u}` : "";
}

/** short unit used in the ticker: টাকা/কেজি */
export const unitShort = (unit: string) => unitBn(unit).replace("প্রতি ", "");
