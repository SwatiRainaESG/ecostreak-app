import React, { useState, useMemo } from "react";
import {
  Search, Leaf, Droplets, Trash2, Recycle, ArrowLeftRight, LayoutDashboard,
  ChevronLeft, Plus, X, Sparkles, Info, MapPin, Award, TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

/* ---------------------------------------------------------------------- */
/*  MOCK DATA                                                              */
/* ---------------------------------------------------------------------- */

const CATEGORIES = ["Beverages", "Cafés", "Food", "Packaging", "Home", "Transportation", "Travel", "Fashion", "Electronics", "Digital Services", "Personal Care", "Hotels", "Restaurants"];

const PRODUCTS = [
  { id: "oat-milk", name: "Oat Milk", brand: "Generic", category: "Beverages", country: "Sweden", score: 88,
    carbon: 0.4, water: 48, waste: 8, packaging: "Recyclable carton", recyclable: true, lifespan: null,
    circularity: 74, confidence: 0.86, source: "Agribalyse", updated: "Jun 2026",
    dims: { climate: 88, water: 80, waste: 78, circularity: 74, biodiversity: 70, resource: 82 },
    insight: "Plant-based milks generate a fraction of the emissions of dairy, mainly from oat farming and light processing.",
    alt: [] },
  { id: "cow-milk", name: "Whole Cow Milk", brand: "Generic", category: "Beverages", country: "USA", score: 46,
    carbon: 3.2, water: 628, waste: 6, packaging: "Recyclable carton", recyclable: true, lifespan: null,
    circularity: 52, confidence: 0.9, source: "ecoinvent", updated: "May 2026",
    dims: { climate: 32, water: 30, waste: 70, circularity: 52, biodiversity: 44, resource: 40 },
    insight: "Dairy's footprint is dominated by methane from cattle and the water/land needed to grow feed.",
    alt: ["oat-milk"] },
  { id: "local-latte", name: "Oat Latte (reusable cup)", brand: "Local Café", category: "Cafés", country: "—", score: 81,
    carbon: 0.5, water: 55, waste: 4, packaging: "Reusable cup", recyclable: true, lifespan: null,
    circularity: 88, confidence: 0.62, source: "Category estimate", updated: "Jun 2026",
    dims: { climate: 82, water: 76, waste: 90, circularity: 88, biodiversity: 68, resource: 74 },
    insight: "Bringing or using a reusable cup removes almost all packaging waste from a café order.",
    alt: [] },
  { id: "chain-latte", name: "Chain Latte (disposable cup)", brand: "Starbucks", category: "Cafés", country: "—", score: 58,
    carbon: 1.1, water: 210, waste: 34, packaging: "Single-use cup + lid", recyclable: false, lifespan: null,
    circularity: 38, confidence: 0.7, source: "Category estimate", updated: "Jun 2026",
    dims: { climate: 60, water: 55, waste: 30, circularity: 38, biodiversity: 58, resource: 56 },
    insight: "Dairy milk and a non-recyclable cup-lid combo pull this down versus the reusable-cup version.",
    alt: ["local-latte"] },
  { id: "beef-burger", name: "Beef Burger", brand: "Generic", category: "Food", country: "USA", score: 22,
    carbon: 6.6, water: 1450, waste: 12, packaging: "Paper wrap", recyclable: true, lifespan: null,
    circularity: 40, confidence: 0.92, source: "Agribalyse · IPCC", updated: "Apr 2026",
    dims: { climate: 12, water: 14, waste: 55, circularity: 40, biodiversity: 18, resource: 30 },
    insight: "Beef is the single highest-impact common food, driven by methane and land use for grazing and feed.",
    alt: ["lentil-bowl", "chicken-breast"] },
  { id: "lentil-bowl", name: "Lentil Bowl", brand: "Generic", category: "Food", country: "Canada", score: 92,
    carbon: 0.5, water: 190, waste: 5, packaging: "None / bulk", recyclable: true, lifespan: null,
    circularity: 90, confidence: 0.85, source: "Agribalyse", updated: "May 2026",
    dims: { climate: 94, water: 86, waste: 92, circularity: 90, biodiversity: 88, resource: 90 },
    insight: "Legumes fix their own nitrogen and need little water or land, making them one of the lowest-impact proteins.",
    alt: [] },
  { id: "chicken-breast", name: "Chicken Breast", brand: "Generic", category: "Food", country: "USA", score: 61,
    carbon: 1.9, water: 410, waste: 8, packaging: "Plastic tray", recyclable: false, lifespan: null,
    circularity: 46, confidence: 0.88, source: "Agribalyse", updated: "May 2026",
    dims: { climate: 58, water: 62, waste: 40, circularity: 46, biodiversity: 60, resource: 58 },
    insight: "Poultry is far lower-impact than beef, but the plastic tray and feed-grain footprint keep it out of the top tier.",
    alt: ["lentil-bowl"] },
  { id: "plastic-bottle", name: "Plastic Water Bottle (500ml)", brand: "Generic", category: "Packaging", country: "—", score: 28,
    carbon: 0.22, water: 3, waste: 22, packaging: "Single-use PET", recyclable: true, lifespan: "Single use",
    circularity: 30, confidence: 0.8, source: "EEA", updated: "Mar 2026",
    dims: { climate: 45, water: 90, waste: 10, circularity: 22, biodiversity: 30, resource: 20 },
    insight: "Low water use per bottle is outweighed by single-use plastic waste and virgin petrochemical inputs.",
    alt: ["steel-bottle"] },
  { id: "steel-bottle", name: "Reusable Steel Bottle", brand: "Generic", category: "Home", country: "—", score: 96,
    carbon: 0.02, water: 0.4, waste: 0.1, packaging: "None (reused)", recyclable: true, lifespan: "10+ years",
    circularity: 98, confidence: 0.75, source: "Category estimate", updated: "Jun 2026",
    dims: { climate: 97, water: 96, waste: 99, circularity: 98, biodiversity: 90, resource: 94 },
    insight: "Amortized over hundreds of refills, a steel bottle's per-use footprint is negligible.",
    alt: [] },
  { id: "train-ticket", name: "Domestic Train (300km)", brand: "—", category: "Transportation", country: "—", score: 89,
    carbon: 6, water: 2, waste: 0.1, packaging: "—", recyclable: null, lifespan: null,
    circularity: null, confidence: 0.83, source: "DEFRA", updated: "Apr 2026",
    dims: { climate: 90, water: 95, waste: 96, circularity: 80, biodiversity: 85, resource: 88 },
    insight: "Electrified rail is one of the lowest-carbon ways to move a person any real distance.",
    alt: [] },
  { id: "flight", name: "Domestic Flight (300km)", brand: "—", category: "Travel", country: "—", score: 12,
    carbon: 55, water: 4, waste: 0.3, packaging: "—", recyclable: null, lifespan: null,
    circularity: null, confidence: 0.87, source: "DEFRA · EEA", updated: "Apr 2026",
    dims: { climate: 5, water: 90, waste: 88, circularity: 60, biodiversity: 40, resource: 20 },
    insight: "Short-haul flights burn most fuel in takeoff/climb, giving them a disproportionate footprint per km.",
    alt: ["train-ticket"] },
  { id: "running-shoes", name: "Running Shoes", brand: "Generic", category: "Fashion", country: "Vietnam", score: 44,
    carbon: 14, water: 4400, waste: 0.3, packaging: "Cardboard box", recyclable: true, lifespan: "12–18 months",
    circularity: 38, confidence: 0.6, source: "PEF estimate", updated: "Feb 2026",
    dims: { climate: 42, water: 30, waste: 50, circularity: 38, biodiversity: 46, resource: 44 },
    insight: "Synthetic foams and glued, multi-material construction make most sneakers hard to recycle or repair.",
    alt: ["recycled-jacket"] },
  { id: "recycled-jacket", name: "Recycled Fleece Jacket", brand: "Patagonia", category: "Fashion", country: "USA", score: 79,
    carbon: 8, water: 900, waste: 0.2, packaging: "Minimal", recyclable: true, lifespan: "5+ years",
    circularity: 84, confidence: 0.7, source: "EPD", updated: "Jan 2026",
    dims: { climate: 74, water: 70, waste: 82, circularity: 84, biodiversity: 76, resource: 78 },
    insight: "Recycled polyester and a take-back repair program meaningfully extend this garment's usable life.",
    alt: [] },
  { id: "iphone", name: "Smartphone", brand: "Generic", category: "Electronics", country: "China", score: 52,
    carbon: 70, water: 13000, waste: 0.15, packaging: "Recyclable box", recyclable: false, lifespan: "3–4 years",
    circularity: 44, confidence: 0.65, source: "PEF · EPD", updated: "Mar 2026",
    dims: { climate: 40, water: 34, waste: 60, circularity: 44, biodiversity: 50, resource: 36 },
    insight: "Most of a phone's footprint is locked in at manufacturing — critical minerals and chip fabrication.",
    alt: [] },
  { id: "netflix-hour", name: "Streaming (1 hour, HD)", brand: "Netflix", category: "Digital Services", country: "—", score: 90,
    carbon: 0.06, water: 0.5, waste: 0, packaging: "—", recyclable: null, lifespan: null,
    circularity: null, confidence: 0.55, source: "Category estimate", updated: "Jun 2026",
    dims: { climate: 92, water: 94, waste: 100, circularity: 80, biodiversity: 88, resource: 86 },
    insight: "Data-center efficiency has fallen sharply per hour streamed, though renewable mix varies by region.",
    alt: [] },

  /* ---------------- Fashion ---------------- */
  { id: "cotton-tshirt", name: "Organic Cotton T-Shirt", brand: "Generic", category: "Fashion", country: "India", score: 68,
    carbon: 4.3, water: 2700, waste: 0.1, packaging: "Minimal", recyclable: true, lifespan: "2–3 years",
    circularity: 60, confidence: 0.68, source: "PEF estimate", updated: "Feb 2026",
    dims: { climate: 62, water: 46, waste: 74, circularity: 60, biodiversity: 58, resource: 64 },
    insight: "Organic cotton skips synthetic fertilizer, but growing cotton is still water-intensive.",
    alt: [] },
  { id: "fast-fashion-dress", name: "Fast-Fashion Dress", brand: "Generic", category: "Fashion", country: "Bangladesh", score: 26,
    carbon: 17, water: 900, waste: 0.3, packaging: "Plastic poly bag", recyclable: false, lifespan: "~6 months",
    circularity: 20, confidence: 0.55, source: "Category estimate", updated: "Jan 2026",
    dims: { climate: 24, water: 55, waste: 22, circularity: 16, biodiversity: 30, resource: 22 },
    insight: "Synthetic fibers keep water use moderate, but a short wear life and low garment recovery make this a low scorer overall.",
    alt: ["cotton-tshirt", "recycled-jacket"] },
  { id: "leather-boots", name: "Leather Boots", brand: "Generic", category: "Fashion", country: "Italy", score: 39,
    carbon: 15, water: 8000, waste: 0.2, packaging: "Cardboard box", recyclable: false, lifespan: "3–5 years",
    circularity: 42, confidence: 0.6, source: "PEF estimate", updated: "Mar 2026",
    dims: { climate: 36, water: 20, waste: 48, circularity: 42, biodiversity: 34, resource: 40 },
    insight: "Leather tanning is one of the most water- and chemical-intensive steps in any garment supply chain.",
    alt: ["recycled-jacket"] },

  /* ---------------- Home ---------------- */
  { id: "led-bulb", name: "LED Light Bulb", brand: "Generic", category: "Home", country: "China", score: 91,
    carbon: 1.2, water: 5, waste: 0.02, packaging: "Cardboard", recyclable: true, lifespan: "10+ years",
    circularity: 80, confidence: 0.7, source: "Category estimate", updated: "Feb 2026",
    dims: { climate: 92, water: 90, waste: 88, circularity: 80, biodiversity: 84, resource: 78 },
    insight: "Lifetime footprint is dominated by the electricity it uses — LEDs need a fraction of an incandescent's power.",
    alt: [] },
  { id: "incandescent-bulb", name: "Incandescent Bulb", brand: "Generic", category: "Home", country: "China", score: 34,
    carbon: 9, water: 3, waste: 0.05, packaging: "Cardboard", recyclable: false, lifespan: "~1 year",
    circularity: 20, confidence: 0.65, source: "Category estimate", updated: "Feb 2026",
    dims: { climate: 28, water: 92, waste: 40, circularity: 20, biodiversity: 60, resource: 30 },
    insight: "Most of the footprint comes from wasted heat — over 90% of the energy in never becomes light.",
    alt: ["led-bulb"] },
  { id: "dish-soap-refill", name: "Dish Soap (refill pouch)", brand: "Generic", category: "Home", country: "—", score: 84,
    carbon: 0.3, water: 40, waste: 0.01, packaging: "Refill pouch", recyclable: true, lifespan: null,
    circularity: 76, confidence: 0.6, source: "Category estimate", updated: "Apr 2026",
    dims: { climate: 82, water: 78, waste: 90, circularity: 76, biodiversity: 74, resource: 80 },
    insight: "A thin refill pouch uses far less plastic per wash than a rigid bottle bought new each time.",
    alt: [] },
  { id: "dish-soap-plastic", name: "Dish Soap (plastic bottle)", brand: "Generic", category: "Home", country: "—", score: 55,
    carbon: 0.5, water: 45, waste: 0.08, packaging: "Single-use plastic bottle", recyclable: true, lifespan: null,
    circularity: 45, confidence: 0.65, source: "Category estimate", updated: "Apr 2026",
    dims: { climate: 56, water: 72, waste: 38, circularity: 45, biodiversity: 60, resource: 50 },
    insight: "The rigid bottle is recyclable, but a new one made per purchase adds up versus a refill.",
    alt: ["dish-soap-refill"] },
  { id: "paper-towels", name: "Paper Towels (per roll)", brand: "Generic", category: "Home", country: "USA", score: 41,
    carbon: 1.1, water: 70, waste: 0.15, packaging: "Plastic wrap", recyclable: false, lifespan: "Single use",
    circularity: 25, confidence: 0.6, source: "Category estimate", updated: "Mar 2026",
    dims: { climate: 40, water: 58, waste: 20, circularity: 25, biodiversity: 42, resource: 38 },
    insight: "Virgin pulp and a single-use design mean the footprint resets with every roll.",
    alt: ["reusable-cloth"] },
  { id: "reusable-cloth", name: "Reusable Cleaning Cloth", brand: "Generic", category: "Home", country: "—", score: 93,
    carbon: 0.05, water: 8, waste: 0.01, packaging: "None", recyclable: true, lifespan: "3+ years",
    circularity: 92, confidence: 0.65, source: "Category estimate", updated: "Mar 2026",
    dims: { climate: 94, water: 92, waste: 96, circularity: 92, biodiversity: 88, resource: 90 },
    insight: "Washed and reused hundreds of times, its per-use footprint is nearly negligible.",
    alt: [] },

  /* ---------------- Travel & Hotels ---------------- */
  { id: "hotel-eco", name: "Hotel Stay (eco-certified)", brand: "—", category: "Hotels", country: "—", score: 82,
    carbon: 12, water: 300, waste: 0.5, packaging: "—", recyclable: null, lifespan: null,
    circularity: null, confidence: 0.58, source: "Category estimate", updated: "May 2026",
    dims: { climate: 78, water: 74, waste: 80, circularity: 70, biodiversity: 76, resource: 80 },
    insight: "Solar offsetting, linen-reuse programs, and low-flow fixtures meaningfully cut a stay's footprint.",
    alt: [] },
  { id: "hotel-standard", name: "Hotel Stay (standard)", brand: "—", category: "Hotels", country: "—", score: 49,
    carbon: 32, water: 550, waste: 1.2, packaging: "—", recyclable: null, lifespan: null,
    circularity: null, confidence: 0.58, source: "Category estimate", updated: "May 2026",
    dims: { climate: 44, water: 48, waste: 40, circularity: 38, biodiversity: 50, resource: 46 },
    insight: "Daily linen changes, single-use toiletries, and no renewable energy commitment keep this mid-pack.",
    alt: ["hotel-eco"] },
  { id: "rental-car", name: "Rental Car, petrol (100km)", brand: "—", category: "Travel", country: "—", score: 24,
    carbon: 21, water: 5, waste: 0.1, packaging: "—", recyclable: null, lifespan: null,
    circularity: null, confidence: 0.75, source: "DEFRA", updated: "Apr 2026",
    dims: { climate: 20, water: 88, waste: 86, circularity: 50, biodiversity: 40, resource: 22 },
    insight: "Per-passenger emissions from a petrol car are several times higher than rail for the same trip.",
    alt: ["train-ticket", "electric-car"] },
  { id: "electric-car", name: "Electric Car (100km)", brand: "—", category: "Travel", country: "—", score: 66,
    carbon: 9, water: 4, waste: 0.05, packaging: "—", recyclable: null, lifespan: null,
    circularity: null, confidence: 0.7, source: "EEA", updated: "Apr 2026",
    dims: { climate: 64, water: 90, waste: 90, circularity: 55, biodiversity: 58, resource: 52 },
    insight: "Footprint depends heavily on grid mix — cleaner in countries with more renewable electricity.",
    alt: ["train-ticket"] },
  { id: "long-haul-flight", name: "Long-Haul Flight (per 1000km)", brand: "—", category: "Travel", country: "—", score: 15,
    carbon: 115, water: 8, waste: 0.4, packaging: "—", recyclable: null, lifespan: null,
    circularity: null, confidence: 0.85, source: "DEFRA · EEA", updated: "Apr 2026",
    dims: { climate: 8, water: 85, waste: 80, circularity: 55, biodiversity: 38, resource: 18 },
    insight: "Long-haul cruise segments are more fuel-efficient per km than short-haul, but total distance still dominates the footprint.",
    alt: [] },

  /* ---------------- Personal Care ---------------- */
  { id: "shampoo-bar", name: "Shampoo Bar", brand: "Generic", category: "Personal Care", country: "—", score: 89,
    carbon: 0.3, water: 15, waste: 0.01, packaging: "Paper wrap", recyclable: true, lifespan: "~80 washes",
    circularity: 85, confidence: 0.6, source: "Category estimate", updated: "May 2026",
    dims: { climate: 88, water: 90, waste: 94, circularity: 85, biodiversity: 80, resource: 84 },
    insight: "No water is shipped and no bottle is made — concentrated bars cut packaging and transport weight.",
    alt: [] },
  { id: "plastic-shampoo", name: "Shampoo (plastic bottle)", brand: "Generic", category: "Personal Care", country: "—", score: 48,
    carbon: 0.6, water: 25, waste: 0.12, packaging: "Plastic bottle", recyclable: true, lifespan: null,
    circularity: 40, confidence: 0.65, source: "Category estimate", updated: "May 2026",
    dims: { climate: 48, water: 62, waste: 34, circularity: 40, biodiversity: 50, resource: 46 },
    insight: "Mostly water by weight, so a plastic bottle is shipping and packaging water — the bar skips both.",
    alt: ["shampoo-bar"] },

  /* ---------------- Restaurants ---------------- */
  { id: "fast-food-meal", name: "Fast Food Combo Meal", brand: "Generic", category: "Restaurants", country: "—", score: 33,
    carbon: 4.5, water: 900, waste: 0.4, packaging: "Disposable", recyclable: false, lifespan: null,
    circularity: 30, confidence: 0.55, source: "Category estimate", updated: "Jun 2026",
    dims: { climate: 30, water: 34, waste: 22, circularity: 30, biodiversity: 32, resource: 34 },
    insight: "Beef-based mains and fully disposable packaging stack two of the biggest impact drivers together.",
    alt: ["farm-to-table-meal", "lentil-bowl"] },
  { id: "farm-to-table-meal", name: "Farm-to-Table Meal", brand: "Generic", category: "Restaurants", country: "—", score: 77,
    carbon: 1.8, water: 350, waste: 0.1, packaging: "Reusable dishware", recyclable: true, lifespan: null,
    circularity: 78, confidence: 0.55, source: "Category estimate", updated: "Jun 2026",
    dims: { climate: 74, water: 70, waste: 86, circularity: 78, biodiversity: 72, resource: 76 },
    insight: "Local, seasonal sourcing and reusable dishware cut both transport emissions and packaging waste.",
    alt: [] },
];

const CATEGORY_AVG = 61;

/* ---------------------------------------------------------------------- */
/*  HELPERS                                                                */
/* ---------------------------------------------------------------------- */

function scoreToGrade(score) {
  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  if (score >= 20) return "E";
  return "F";
}

function gradeColor(grade) {
  return {
    "A+": { bg: "bg-emerald-700", text: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-700" },
    "A": { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-600" },
    "B": { bg: "bg-lime-600", text: "text-lime-700", light: "bg-lime-50", border: "border-lime-600" },
    "C": { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-500" },
    "D": { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50", border: "border-orange-500" },
    "E": { bg: "bg-red-500", text: "text-red-600", light: "bg-red-50", border: "border-red-500" },
    "F": { bg: "bg-red-700", text: "text-red-700", light: "bg-red-50", border: "border-red-700" },
  }[grade];
}

function fmt(n, unit) {
  if (n === null || n === undefined) return "—";
  return `${n < 1 ? n.toFixed(2) : n < 10 ? n.toFixed(1) : Math.round(n)} ${unit}`;
}

/* ---------------------------------------------------------------------- */
/*  SHARED UI PIECES                                                       */
/* ---------------------------------------------------------------------- */

function DimensionBar({ label, icon: Icon, value }) {
  const filled = Math.round((value ?? 0) / 20);
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon size={14} className="text-stone-500 shrink-0" />
      <span className="w-24 text-stone-600 shrink-0">{label}</span>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${i < filled ? "bg-emerald-700" : "bg-stone-200"}`} />
        ))}
      </div>
    </div>
  );
}

/* The signature element: a physical-label-style sustainability tag,
   modeled on EU energy labels — vertical grade bar + perforated hang-hole. */
function EcoLabel({ product, size = "full" }) {
  const grade = scoreToGrade(product.score);
  const c = gradeColor(grade);
  const compact = size === "compact";

  return (
    <div className={`relative bg-white border border-stone-200 rounded-r-lg shadow-sm ${compact ? "w-full" : "max-w-sm"}`}>
      {/* hang hole */}
      <div className="absolute -top-2 left-4 w-4 h-4 rounded-full bg-stone-50 border border-stone-300" />
      <div className="flex">
        <div className={`${c.bg} rounded-l-lg flex flex-col items-center justify-center text-white ${compact ? "w-14 py-3" : "w-20 py-5"}`}>
          <span className={`font-serif font-bold leading-none ${compact ? "text-2xl" : "text-4xl"}`}>{grade}</span>
          <span className={`font-mono opacity-90 ${compact ? "text-[10px]" : "text-xs"} mt-1`}>{product.score}/100</span>
        </div>
        <div className={`flex-1 ${compact ? "p-3" : "p-4"} border-t border-r border-b border-stone-200 rounded-r-lg`}>
          {!compact && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] tracking-widest uppercase text-stone-400 font-medium">EcoStreak Label</span>
              <Info size={13} className="text-stone-300" />
            </div>
          )}
          <div className="space-y-1.5">
            <DimensionBar label="Climate" icon={Leaf} value={product.dims.climate} />
            <DimensionBar label="Water" icon={Droplets} value={product.dims.water} />
            <DimensionBar label="Waste" icon={Trash2} value={product.dims.waste} />
            {!compact && <DimensionBar label="Circularity" icon={Recycle} value={product.dims.circularity} />}
          </div>
          {!compact && (
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-dashed border-stone-200 font-mono text-xs">
              <div>
                <div className="text-stone-400">CO₂e</div>
                <div className="text-stone-800 font-semibold">{fmt(product.carbon, "kg")}</div>
              </div>
              <div>
                <div className="text-stone-400">Water</div>
                <div className="text-stone-800 font-semibold">{fmt(product.water, "L")}</div>
              </div>
              <div>
                <div className="text-stone-400">End-of-life</div>
                <div className="text-stone-800 font-semibold">{product.recyclable === null ? "—" : product.recyclable ? "Recycle" : "Landfill"}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScorePill({ score }) {
  const grade = scoreToGrade(score);
  const c = gradeColor(grade);
  return (
    <div className={`inline-flex items-center gap-1.5 ${c.light} ${c.text} px-2.5 py-1 rounded-full text-xs font-semibold border ${c.border}/30`}>
      <span className="font-serif">{grade}</span>
      <span className="font-mono opacity-70">{score}</span>
    </div>
  );
}

function TopNav({ view, setView }) {
  const items = [
    { id: "home", label: "Search", icon: Search },
    { id: "compare", label: "Compare", icon: ArrowLeftRight },
    { id: "tracker", label: "Dashboard", icon: LayoutDashboard },
  ];
  return (
    <div className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button onClick={() => setView("home")} className="flex items-center gap-2 font-serif text-lg font-semibold text-stone-900">
          <div className="w-7 h-7 rounded-md bg-emerald-700 text-white flex items-center justify-center">
            <Leaf size={15} />
          </div>
          EcoStreak
        </button>
        <div className="flex gap-1">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === it.id ? "bg-emerald-700 text-white" : "text-stone-600 hover:bg-stone-200"
              }`}
            >
              <it.icon size={14} />
              <span className="hidden sm:inline">{it.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  HOME / SEARCH                                                          */
/* ---------------------------------------------------------------------- */

function HomeView({ onSelect }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [query]);

  const trending = PRODUCTS.slice(0, 6);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-20">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mb-2">
          Know what it costs the planet.
        </h1>
        <p className="text-stone-500">Search any product, meal, ride, or stay for its Sustainability Intelligence Score.</p>
      </div>

      <div className="relative mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “oat milk”, “beef burger”, “domestic flight”…"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/40 text-stone-800"
        />
      </div>

      {query.trim() ? (
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest text-stone-400 font-medium">{results.length} results</div>
          {results.length === 0 && (
            <div className="text-stone-500 text-sm py-8 text-center border border-dashed border-stone-300 rounded-xl">
              Nothing matched yet — in the full product this falls back to a category-average estimate, clearly labeled.
            </div>
          )}
          {results.map((p) => (
            <ProductRow key={p.id} product={p} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setQuery(c)}
                className="px-3 py-1.5 rounded-full border border-stone-300 text-sm text-stone-600 hover:border-emerald-700 hover:text-emerald-700 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
          <div className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-3">Trending checks</div>
          <div className="space-y-3">
            {trending.map((p) => (
              <ProductRow key={p.id} product={p} onSelect={onSelect} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProductRow({ product, onSelect }) {
  return (
    <button
      onClick={() => onSelect(product.id)}
      className="w-full flex items-center justify-between gap-4 bg-white border border-stone-200 rounded-xl px-4 py-3 hover:border-emerald-700/50 hover:shadow-sm transition-all text-left"
    >
      <div className="min-w-0">
        <div className="font-medium text-stone-800 truncate">{product.name}</div>
        <div className="text-xs text-stone-400">{product.category} {product.brand !== "Generic" && product.brand !== "—" ? `· ${product.brand}` : ""}</div>
      </div>
      <ScorePill score={product.score} />
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/*  PROFILE                                                                */
/* ---------------------------------------------------------------------- */

function ProfileView({ productId, onBack, onSelect }) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;
  const grade = scoreToGrade(product.score);
  const c = gradeColor(grade);
  const alternatives = product.alt.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const delta = product.score - CATEGORY_AVG;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-6">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">{product.category}</div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-1">{product.name}</h1>
          <div className="text-sm text-stone-500 mb-4">{product.brand !== "Generic" ? product.brand : "Category average"} · {product.country}</div>
          <p className={`${c.light} ${c.text} rounded-lg px-4 py-3 text-sm leading-relaxed border ${c.border}/20`}>
            {product.insight}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-stone-500">
            <TrendingUp size={13} />
            {delta >= 0
              ? `${Math.abs(Math.round(delta))} points above the ${product.category.toLowerCase()} average`
              : `${Math.abs(Math.round(delta))} points below the ${product.category.toLowerCase()} average`}
          </div>
        </div>
        <div className="sm:ml-auto shrink-0">
          <EcoLabel product={product} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <InfoCard label="Packaging" value={product.packaging} />
        <InfoCard label="Recyclable" value={product.recyclable === null ? "N/A" : product.recyclable ? "Yes" : "No"} />
        <InfoCard label="Lifespan" value={product.lifespan || "N/A"} />
        <InfoCard label="Confidence" value={`${Math.round(product.confidence * 100)}%`} sub={`${product.source} · ${product.updated}`} />
      </div>

      {alternatives.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-emerald-700" />
            <div className="text-sm font-medium text-stone-800">Better alternatives</div>
          </div>
          <div className="space-y-2">
            {alternatives.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3">
                <div>
                  <button onClick={() => onSelect(a.id)} className="font-medium text-stone-800 hover:text-emerald-700 transition-colors">
                    {a.name}
                  </button>
                  <div className="text-xs text-stone-400">
                    Saves ~{Math.max(0, (product.carbon - a.carbon)).toFixed(1)} kg CO₂e vs. this item
                  </div>
                </div>
                <ScorePill score={a.score} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl px-4 py-3">
      <div className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">{label}</div>
      <div className="text-stone-800 font-medium">{value}</div>
      {sub && <div className="text-xs text-stone-400 mt-0.5 font-mono">{sub}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  COMPARE                                                                */
/* ---------------------------------------------------------------------- */

function CompareView() {
  const [leftId, setLeftId] = useState("beef-burger");
  const [rightId, setRightId] = useState("lentil-bowl");
  const left = PRODUCTS.find((p) => p.id === leftId);
  const right = PRODUCTS.find((p) => p.id === rightId);
  const better = left.score >= right.score ? left : right;
  const worse = better.id === left.id ? right : left;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-6">Compare</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Picker value={leftId} onChange={setLeftId} />
        <Picker value={rightId} onChange={setRightId} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <EcoLabel product={left} />
        <EcoLabel product={right} />
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
        {["climate", "water", "waste", "circularity"].map((dim) => (
          <div key={dim} className="grid grid-cols-[80px_1fr_1fr] items-center gap-3 py-2 border-b border-stone-100 last:border-0">
            <span className="text-xs uppercase tracking-wide text-stone-400 capitalize">{dim}</span>
            <MiniBar value={left.dims[dim]} align="right" />
            <MiniBar value={right.dims[dim]} align="left" />
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-700/20 rounded-xl px-5 py-4 text-sm text-emerald-900">
        <span className="font-semibold">{better.name}</span> is the better choice — roughly{" "}
        <span className="font-mono font-semibold">{Math.max(0, worse.carbon - better.carbon).toFixed(1)} kg CO₂e</span> and{" "}
        <span className="font-mono font-semibold">{Math.max(0, worse.water - better.water).toFixed(0)} L water</span> lower per unit than {worse.name}.
      </div>
    </div>
  );
}

function Picker({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
    >
      {PRODUCTS.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  );
}

function MiniBar({ value, align }) {
  return (
    <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  TRACKER + DASHBOARD                                                    */
/* ---------------------------------------------------------------------- */

const WEEK_HISTORY = [
  { day: "Mon", score: 64 },
  { day: "Tue", score: 71 },
  { day: "Wed", score: 58 },
  { day: "Thu", score: 76 },
  { day: "Fri", score: 69 },
  { day: "Sat", score: 62 },
];

const PIE_COLORS = ["#047857", "#65a30d", "#f59e0b", "#ea580c"];

function TrackerView() {
  const [todayLog, setTodayLog] = useState([PRODUCTS[0].id, PRODUCTS[5].id]);
  const [picker, setPicker] = useState(PRODUCTS[0].id);

  const todayItems = todayLog.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const todayScore = todayItems.length ? Math.round(todayItems.reduce((s, p) => s + p.score, 0) / todayItems.length) : 0;
  const todayCarbon = todayItems.reduce((s, p) => s + p.carbon, 0);

  const chartData = [...WEEK_HISTORY, { day: "Today", score: todayScore || null }];

  const categoryBreakdown = useMemo(() => {
    const counts = {};
    todayItems.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [todayItems]);

  const weekAvg = Math.round(WEEK_HISTORY.reduce((s, d) => s + d.score, 0) / WEEK_HISTORY.length);
  const baselineCarbon = 8.4; // mock "average day" baseline
  const carbonSaved = Math.max(0, baselineCarbon - todayCarbon);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-6">Your Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Today's score" value={todayItems.length ? `${todayScore}` : "—"} sub={todayItems.length ? scoreToGrade(todayScore) : "Log something below"} icon={Award} />
        <StatCard label="Weekly average" value={`${weekAvg}`} sub={scoreToGrade(weekAvg)} icon={TrendingUp} />
        <StatCard label="CO₂e saved today" value={`${carbonSaved.toFixed(1)} kg`} sub="vs. an average day" icon={Leaf} />
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="sm:col-span-2 bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-sm font-medium text-stone-700 mb-3">Weekly trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#f0ede6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#78716c" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#047857" strokeWidth={2.5} dot={{ r: 4, fill: "#047857" }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-sm font-medium text-stone-700 mb-3">Today's categories</div>
          {categoryBreakdown.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-stone-400 h-[220px] flex items-center justify-center text-center">Log an activity to see today's mix</div>
          )}
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 mb-8">
        <div className="text-sm font-medium text-stone-700 mb-3">Log today's activity</div>
        <div className="flex gap-2 mb-4">
          <select
            value={picker}
            onChange={(e) => setPicker(e.target.value)}
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
          >
            {PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.category}</option>)}
          </select>
          <button
            onClick={() => setTodayLog((l) => [...l, picker])}
            className="flex items-center gap-1 bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800 transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {todayItems.map((p, i) => (
            <div key={i} className="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2">
              <div className="text-sm text-stone-700">{p.name}</div>
              <div className="flex items-center gap-3">
                <ScorePill score={p.score} />
                <button onClick={() => setTodayLog((l) => l.filter((_, idx) => idx !== i))} className="text-stone-400 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
          {todayItems.length === 0 && <div className="text-sm text-stone-400 text-center py-4">Nothing logged yet today.</div>}
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5">
        <div className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2"><MapPin size={14} /> Milestones</div>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="border border-stone-100 rounded-lg p-3"><div className="font-medium text-stone-800">7-day streak</div><div className="text-stone-400 text-xs mt-0.5">Logged every day this week</div></div>
          <div className="border border-stone-100 rounded-lg p-3"><div className="font-medium text-stone-800">50 kg CO₂e saved</div><div className="text-stone-400 text-xs mt-0.5">Cumulative vs. category average</div></div>
          <div className="border border-stone-100 rounded-lg p-3"><div className="font-medium text-stone-800">Reuse habit</div><div className="text-stone-400 text-xs mt-0.5">3 reusable swaps logged</div></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">{label}</span>
        <Icon size={14} className="text-emerald-700" />
      </div>
      <div className="font-serif text-2xl font-semibold text-stone-900">{value}</div>
      <div className="text-xs text-stone-400 mt-0.5">{sub}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  APP SHELL                                                              */
/* ---------------------------------------------------------------------- */

export default function EcoStreakDemo() {
  const [view, setView] = useState("home");
  const [productId, setProductId] = useState(null);

  function selectProduct(id) {
    setProductId(id);
    setView("profile");
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <TopNav view={view === "profile" ? "home" : view} setView={setView} />
      {view === "home" && <HomeView onSelect={selectProduct} />}
      {view === "profile" && <ProfileView productId={productId} onBack={() => setView("home")} onSelect={selectProduct} />}
      {view === "compare" && <CompareView />}
      {view === "tracker" && <TrackerView />}
    </div>
  );
}
