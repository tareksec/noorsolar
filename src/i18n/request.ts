import { getRequestConfig } from "next-intl/server";
import { routing, Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const messages =
    locale === "bn"
      ? (await import("../../messages/bn.json")).default
      : (await import("../../messages/en.json")).default;

  return {
    locale,
    messages,
  };
});
