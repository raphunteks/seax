/**
 * Brand facts read from the owner's Instagram (@toko.kopisea).
 * Items marked CONFIRM were seen on a seasonal post and need the owner's yes before launch.
 */
export const site = {
  name: "Kopi SEA",
  storeName: "Toko Kopi Sea",
  tagline: "Dari teman, untuk setiap momen.",
  instagram: { handle: "toko.kopisea", url: "https://www.instagram.com/toko.kopisea/" },
  /** Confirmed by the owner on 2026-11-05: every day, 08.00-23.30 WITA (updated by the owner on 2026-11-05). */
  hours: { open: "08:00", close: "23:30", openLabel: "08.00", closeLabel: "23.30", zoneLabel: "WITA" },
  /** Opening hours are evaluated in this zone, whatever the visitor's own zone is. */
  timeZone: "Asia/Makassar",
  /**
   * Three branches. Coordinates come from the owner; all three have owner-supplied Google embeds.
   * orderUrl is what each branch's own QR code points to (the shop app), read from the QR images the owner supplied.
   */
  branches: [
    {
      id: "mappaoddang",
      name: "Toko Kopi Sea Mappaoddang",
      address: "Jalan Andi Mappaoddang",
      orderUrl: "https://shop.runut.tech/points?id=162-0362706-B74D-4E6C-9485-F38A9A3755D9",
      qr: "/qr/mappaoddang.png",
      lat: -5.1761848,
      lng: 119.4098693,
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.547778791545!2d119.40986931324008!3d-5.176184799700421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbf1d0009f3235b%3A0x54882a1dfade5bd8!2sKopi%20Sea!5e0!3m2!1sid!2sid!4v1793807470723!5m2!1sid!2sid",
    },
    {
      id: "pk7",
      name: "Toko Kopi Sea PK7",
      address: "Perintis Kemerdekaan 7 (depan Stage PK 7.02)",
      orderUrl: "https://shop.runut.tech/points?id=164-7F83712-76B4-4C5C-A725-C681B367A865",
      qr: "/qr/pk7.png",
      lat: -5.1361401,
      lng: 119.4828029,
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.7983857511836!2d119.4828029!3d-5.136140099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbefd003ff35d13%3A0x7ac3c8336bfdcca7!2sKopi%20Sea%20Perintis%20Kemerdekaan%207!5e0!3m2!1sid!2sid!4v1793875456863!5m2!1sid!2sid",
    },
    {
      id: "toddopuli",
      name: "Toko Kopi Sea Toddopuli 10",
      address: "Toddopuli 10",
      orderUrl: "https://shop.runut.tech/points?id=165-0C7F9E1-1D79-47CD-AF5B-296DE655D098",
      qr: "/qr/toddopuli.png",
      lat: -5.1654372,
      lng: 119.4589085,
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31788.972619162658!2d119.41754910143653!3d-5.164424626302052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee36776b96a85%3A0x4554fa5e003dbbd1!2sKopi%20Sea%20Toddopuli!5e0!3m2!1sid!2sid!4v1793875359366!5m2!1sid!2sid",
    },
  ],
} as const;

export type Branch = (typeof site.branches)[number];

export function mapsUrl(b: Pick<Branch, "lat" | "lng">): string {
  return `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`;
}
