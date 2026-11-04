import { site } from "../data/site";
import { menu } from "../data/menu";

/** Rich structured data for search engines (Schema.org / JSON-LD). */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["CafeOrCoffeeShop", "LocalBusiness"],
    "@id": "https://kopisea.com/#store",
    name: site.storeName,
    alternateName: ["Kopi SEA", "Kopi Sea Makassar"],
    url: "https://kopisea.com",
    logo: "https://kopisea.com/brand/logo.svg",
    image: "https://kopisea.com/brand/og-image.png",
    description: "Toko Kopi Sea Makassar menyajikan es kopi gula aren, kopi susu, Peach Mont Blanc, dan Matcha Cloud.",
    servesCuisine: ["Coffee", "Indonesian", "Beverages"],
    priceRange: "Rp15.000 - Rp35.000",
    currenciesAccepted: "IDR",
    paymentAccepted: "Cash, QRIS, GoPay, OVO, ShopeePay",
    sameAs: [site.instagram.url],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.branches[0].address,
      addressLocality: "Makassar",
      addressRegion: "Sulawesi Selatan",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.branches[0].lat,
      longitude: site.branches[0].lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${site.branches[0].lat},${site.branches[0].lng}`,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: site.hours.open,
        closes: site.hours.close,
      },
    ],
    department: site.branches.map((b) => ({
      "@type": "CafeOrCoffeeShop",
      name: b.name,
      url: b.orderUrl,
      hasMap: `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: b.address,
        addressLocality: "Makassar",
        addressRegion: "Sulawesi Selatan",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: b.lat,
        longitude: b.lng,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: site.hours.open,
          closes: site.hours.close,
        },
      ],
    })),
    hasMenu: {
      "@type": "Menu",
      name: "Menu Kopi Sea",
      hasMenuItem: menu.map((m) => ({
        "@type": "MenuItem",
        name: m.name,
        offers: {
          "@type": "Offer",
          price: m.price,
          priceCurrency: "IDR",
        },
      })),
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
