import Document, { Html, Head, Main, NextScript } from 'next/document';
import { AvailableLanguage, getDir } from '../lib/i18n';
import { getThemeUrl, resolveTheme } from '../lib/utils';

const meta = {
  title: 'Build in public page',
  description: 'Join 14,752 other makers building in public',
  image: '/img/social.jpg',
};

class CustomDocument extends Document {
  render() {
    // Use the `theme` prop of the page if available
    // to immediately set the correct theme.
    const theme = this.props.__NEXT_DATA__.props.pageProps.theme;
    const resolvedTheme = resolveTheme(theme || 'preferred_color_scheme');
    const themeUrl = getThemeUrl(resolvedTheme, theme);

    return (
      <Html dir={getDir(this.props.locale as AvailableLanguage)}>
        <Head>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@simonda1ey" />
          <link rel="preconnect" href="https://api.github.com" />
          <link rel="preconnect" href="https://avatars3.githubusercontent.com" />

          <link rel="icon" href="/img/icons/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/img/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/svg+xml" href="/img/icons/favicon.svg" />
          <link rel="icon" type="image/png" href="/img/icons/favicon.png" />
          <link rel="manifest" href="/img/icons/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />

          <meta name="description" content={meta.description} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:image" content={meta.image} />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
          <meta name="twitter:image" content={meta.image} />
          <meta name="color-scheme" content="light dark" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="stylesheet" href={themeUrl} crossOrigin="anonymous" id="giscus-theme" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
