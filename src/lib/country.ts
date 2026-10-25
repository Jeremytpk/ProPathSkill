export const COUNTRIES = [
  { code: "CD", name: "DRCongo", label: { en: "DR Congo", fr: "RD Congo" } },
  { code: "CI", name: "Ivory Coast", label: { en: "Côte d'Ivoire", fr: "Côte d'Ivoire" } },
  { code: "SN", name: "Senegal", label: { en: "Senegal", fr: "Sénégal" } },
  { code: "FR", name: "France", label: { en: "France", fr: "France" } },
  { code: "CA", name: "Canada", label: { en: "Canada", fr: "Canada" } },
  { code: "US", name: "United States", label: { en: "United States", fr: "États-Unis" } },
];

/** Country code for pricing, from the country chosen at onboarding (DR Congo by default). */
export function storedCountryCode(): string {
  try {
    const name = localStorage.getItem("propath_country");
    return COUNTRIES.find((c) => c.name === name)?.code || "CD";
  } catch {
    return "CD";
  }
}
