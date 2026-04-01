export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/{(\w+)}/g, (_, key) =>
    String(vars[key] ?? `{${key}}`),
  );
}
