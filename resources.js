/*
  MTB RESOURCES — Edit this file to add, update, or remove items.

  Item fields:
    title       (required) Name shown on the site
    desc        (optional) Short summary shown on the main list
    details     (optional) Longer description shown on the item details page
    features    (optional) Array of bullet points shown on the details page
    category    (optional) Group name shown in sidebar and filters (defaults to "General")
    tags        (optional) Array of short labels, e.g. ["Excel", "BS/AD"]
    downloadUrl (required) Direct link (or "" / "#" for Coming soon)
    previewUrl  (optional) Preview / source link (leave "" to hide button)
    date        (optional) "YYYY-MM-DD" for sorting by Newest / Oldest
    featured    (optional) true = starred and shown first under Featured sort
    slug        (optional) Custom URL ID for details.html?id=... (auto-generated from title if omitted)

  Example item to copy:
  {
    title: "Tool Name",
    desc: "Short summary shown on the main page.",
    details: "Full details shown on the next page before downloading.",
    features: ["Key detail 1", "Key detail 2"],
    category: "Category",
    tags: ["Tag1", "Tag2"],
    downloadUrl: "https://drive.mtb.com.np/example",
    previewUrl: "",
    date: "2026-11-25",
    featured: false,
  },
*/

window.MTB_SITE = {
  name: "mtb.com.np",
  title: "Resources",
  subtitle: "Tools, add-ins, and downloads.",
  githubUrl: "https://github.com/mtbcomnp",
  email: "info@mtb.com.np",
};

window.MTB_RESOURCES = [
  {
    slug: "skydate-converter",
    title: "SkyDate Converter",
    desc: "Excel add-in to convert dates between Bikram Sambat (BS) and Gregorian (AD).",
    details: "An Excel add-in (.xlam) built for auditors, accountants, and Excel users to convert dates accurately between Bikram Sambat (BS) and English Gregorian (AD) calendars in both directions.",
    features: [
      "Converts Bikram Sambat (BS) to Gregorian (AD) and AD to BS",
      "Works directly as an Excel add-in (.xlam)",
    ],
    category: "Xlam",
    tags: ["Excel Add-ins", "Date Converter", "AD TO BS", "BS TO AD"],
    downloadUrl: "https://drive.mtb.com.np/Skydateconverter",
    previewUrl: "https://upload.mtb.com.np/preview/skydateconverter",
    date: "2024-01-10",
    featured: true,
  },
  {
    slug: "busy-accounting-software",
    title: "Busy Accounting Software",
    desc: "Accounting software for small and medium businesses and importing industries.",
    details: "Busywin21 Release 9.7 is an accounting software package designed specifically for small and medium-scale businesses and importing industries.",
    category: "Busywin21 Rel 9.7",
    tags: ["Busy infotech", "Busy 21", "Busywin"],
    downloadUrl: "https://drive.mtb.com.np/Busywin21_v9.7",
    previewUrl: "https://upload.mtb.com.np/preview/busywin21v9.7",
    date: "2024-01-10",
    featured: true,
  },
  {
    slug: "bulk-confirmation-generator",
    title: "Bulk Confirmation Generator",
    desc: "Generates Annex-13 and balance confirmation letters for multiple parties from one file.",
    details: "Generates Annex-13 / balance confirmation letters for multiple parties at once from a single MS Access data file, saving accountants and auditors manual audit work. Adapted from CA Bigen Thapa.",
    features: [
      "Generates Annex-13 / balance confirmation letters in bulk",
      "Uses a single data file to produce letters for multiple parties",
    ],
    category: "Confirmation Generator",
    tags: ["Party Confirmation Creator", "MS Access"],
    downloadUrl: "https://drive.mtb.com.np/bulkconfirmationgenerator",
    previewUrl: "",
    date: "2024-02-05",
    featured: true,
  },
  {
    slug: "nepali-miti-busywin21",
    title: "Nepali Miti for Busywin21",
    desc: "Busy add-on that displays Bikram Sambat dates alongside English dates.",
    details: "A BDS add-on for Busy Accounting Software (Busywin21) that adds Bikram Sambat (BS) dates alongside English dates on vouchers, invoices, and reports so businesses can keep their books in the local calendar without manual conversion.",
    category: "BDS FILE",
    tags: ["Nepali Miti", "BDS"],
    downloadUrl: "https://drive.mtb.com.np/BusyNepaliMiti",
    previewUrl: "https://upload.mtb.com.np/preview/busynepalimiti",
    date: "2024-02-20",
    featured: true,
  },
  {
    slug: "genp",
    title: "GenP",
    desc: "Creative Cloud product patcher.",
    details: "Creative Cloud product patcher utility (EXE).",
    category: "Adobe Patcher",
    tags: ["EXE", "Adobe Tools"],
    downloadUrl: "https://drive.mtb.com.np/AdobetTools",
    previewUrl: "https://gen.paramore.su/",
    date: "2024-03-01",
    featured: true,
  },
  {
    slug: "nepali-miti-tally",
    title: "Nepali Miti For Tally",
    desc: "Tally add-on that brings Bikram Sambat dates alongside English dates.",
    details: "A Nepali Bikram Sambat (BS) add-on (.tcp / TDL) for Tally that displays Nepali dates alongside English dates in vouchers, invoices, and reports for Tally users in Nepal.",
    category: "TCP",
    tags: ["Tally Add-ons", "TDL", "TCP"],
    downloadUrl: "https://drive.mtb.com.np/TallyNepaliMiti",
    previewUrl: "https://upload.mtb.com.np/preview/tallynepalimiti",
    date: "2024-03-15",
    featured: true,
  },
];
