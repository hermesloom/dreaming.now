import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  return {
    messages: (await import(`./i18n/messages/${await requestLocale}.json`))
      .default,
  };
});
