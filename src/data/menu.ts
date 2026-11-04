export type Category = "Ice Coffee" | "Hot Coffee" | "Non Coffee" | "Camilan" | "Literan" | "Add On";
export type DrinkKind =
  | "aren"
  | "arenPremium"
  | "arenHot"
  | "hotAmericano"
  | "pandan"
  | "keripikPisang"
  | "keripikDampo"
  | "keripikSeblak"
  | "literan"
  | "air"
  | "shot"
  | "creamy"
  | "sosial"
  | "sosialHot"
  | "americano"
  | "americanoSpecial"
  | "butterscotch"
  | "sunrise"
  | "avocado"
  | "peach"
  | "matcha"
  | "chocolate"
  | "lemon";

export interface MenuItem {
  slug: string;
  name: string;
  category: Category;
  price: number; // IDR, selling price from the owner's POS
  kind: DrinkKind;
  featured?: boolean;
}

/** Selling prices from the owner's POS and ordering app. Cost figures are internal and never shipped. */
export const menu: readonly MenuItem[] = [
  { slug: "kopi-aktif-aren", name: "Kopi Aktif Aren", category: "Ice Coffee", price: 15000, kind: "aren", featured: true },
  { slug: "kopi-aktif-aren-premium", name: "Kopi Aktif Aren Premium", category: "Ice Coffee", price: 25000, kind: "arenPremium" },
  { slug: "kopi-sosial-ice", name: "Kopi Sosial (Susu) Ice", category: "Ice Coffee", price: 15000, kind: "sosial", featured: true },
  { slug: "kopi-pandan-ice", name: "Kopi Pandan Ice", category: "Ice Coffee", price: 17000, kind: "pandan" },
  { slug: "americano-ice", name: "Americano Ice", category: "Ice Coffee", price: 15000, kind: "americano" },
  { slug: "americano-spesial-beans", name: "Americano Spesial Beans", category: "Ice Coffee", price: 18000, kind: "americanoSpecial" },
  { slug: "butterscotch", name: "Butterscotch", category: "Ice Coffee", price: 20000, kind: "butterscotch" },
  { slug: "kopi-sunrise", name: "Kopi Sunrise", category: "Ice Coffee", price: 17000, kind: "sunrise" },
  { slug: "avocado-coffee-ice", name: "Avocado Coffee Ice", category: "Ice Coffee", price: 15000, kind: "avocado" },
  { slug: "peach-mont-blanc", name: "Peach Mont Blanc Ice", category: "Ice Coffee", price: 17000, kind: "peach", featured: true },
  { slug: "kopi-aktif-aren-hot", name: "Kopi Aktif Aren Hot", category: "Hot Coffee", price: 13000, kind: "arenHot" },
  { slug: "kopi-sosial-hot", name: "Kopi Sosial (Susu) Hot", category: "Hot Coffee", price: 13000, kind: "sosialHot" },
  { slug: "hot-americano", name: "Hot Americano", category: "Hot Coffee", price: 13000, kind: "hotAmericano" },
  { slug: "matcha-cloud", name: "Matcha Cloud", category: "Non Coffee", price: 15000, kind: "matcha", featured: true },
  { slug: "chocolate-cloud", name: "Chocolate Cloud", category: "Non Coffee", price: 15000, kind: "chocolate" },
  { slug: "lemon-honey", name: "Lemon Honey", category: "Non Coffee", price: 15000, kind: "lemon" },
  { slug: "air-botol-alkaline-600ml", name: "Air Botol Alkaline 600ml", category: "Non Coffee", price: 6000, kind: "air" },
  { slug: "keripik-pisang", name: "Keripik Pisang", category: "Camilan", price: 12000, kind: "keripikPisang" },
  { slug: "keripik-pisang-dampo", name: "Keripik Pisang Dampo", category: "Camilan", price: 17000, kind: "keripikDampo" },
  { slug: "keripik-seblak", name: "Keripik Seblak", category: "Camilan", price: 12000, kind: "keripikSeblak" },
  { slug: "kopi-aktif-1-liter", name: "Kopi Aktif 1 Liter", category: "Literan", price: 80000, kind: "literan" },
  { slug: "extra-creamy", name: "Extra Creamy", category: "Add On", price: 3000, kind: "creamy" },
  { slug: "extra-shot", name: "Extra Shot", category: "Add On", price: 3000, kind: "shot" },
] as const;

export const categories: readonly Category[] = ["Ice Coffee", "Hot Coffee", "Non Coffee", "Camilan", "Literan", "Add On"];

export const featured = menu.filter((m) => m.featured);

export function formatIDR(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}

export function bySlug(slug: string): MenuItem | undefined {
  return menu.find((m) => m.slug === slug);
}
