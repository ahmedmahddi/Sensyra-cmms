import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // For now, default to French (Tunisia's primary language)
  const locale = 'fr';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
