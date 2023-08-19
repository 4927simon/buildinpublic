import Head from 'next/head';
import Script from 'next/script';
import { ComponentProps, useContext, useEffect, useState } from 'react';
import Comment from '../components/Comment';
import { useDebounce } from '../lib/hooks';
import Configuration from '../components/Configuration';
import { ThemeContext } from '../lib/context';
import { sendData } from '../lib/messages';
import { ISetConfigMessage } from '../lib/types/giscus';
import { getThemeUrl } from '../lib/utils';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Router from 'next/router';
import { AvailableLanguage } from '../lib/i18n';
import { env } from '../lib/variables';

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      locale: locale as AvailableLanguage,
    },
  };
}

type DirectConfig = ComponentProps<typeof Configuration>['directConfig'];
type DirectConfigHandler = ComponentProps<typeof Configuration>['onDirectConfigChange'];

export default function Home({ locale }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [directConfig, setDirectConfig] = useState<DirectConfig>({
    theme: 'preferred_color_scheme',
    themeUrl: `${env.app_host}/themes/custom_example.css`,
    reactionsEnabled: true,
    emitMetadata: false,
    lang: locale,
    inputPosition: 'bottom',
  });
  const themeUrl = useDebounce(directConfig.themeUrl);
  const configTheme = getThemeUrl(directConfig.theme, themeUrl);

  const handleDirectConfigChange: DirectConfigHandler = (key, value) =>
    setDirectConfig({ ...directConfig, [key]: value });

  useEffect(() => {
    setTheme(configTheme);
  }, [setTheme, configTheme]);

  useEffect(() => {
    const data: ISetConfigMessage = {
      setConfig: {
        theme: configTheme,
        reactionsEnabled: directConfig.reactionsEnabled,
        emitMetadata: directConfig.emitMetadata,
        inputPosition: directConfig.inputPosition,
        lang: directConfig.lang,
      },
    };
    sendData(data, location.origin);
  }, [
    directConfig.emitMetadata,
    directConfig.reactionsEnabled,
    directConfig.inputPosition,
    directConfig.lang,
    configTheme,
    themeUrl,
  ]);

  useEffect(() => {
    Router.replace(Router.asPath, Router.pathname, {
      locale: directConfig.lang,
      scroll: false,
    });
  }, [directConfig.lang]);

  return (
    <main className="gsc-homepage-bg min-h-screen w-full" data-theme={theme}>
      <Head>
        <title>giscus</title>
        <meta name="giscus:backlink" content={env.app_host} />
      </Head>
      <div className="color-text-primary w-full max-w-3xl mx-auto p-2">
        <Comment comment={null}>
          <Configuration
            directConfig={directConfig}
            onDirectConfigChange={handleDirectConfigChange}
          />
        </Comment>

        <div id="comments" className="giscus w-full my-8" />
        <Script
          src="/client.js"
          data-repo="4927simon/buildinpublic"
          data-repo-id="R_kgDOKIz6vw"
          data-category="Announcements"
          data-category-id="DIC_kwDOKIz6v84CYtIM"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="preferred_color_scheme"
          data-lang="en"
        />
      </div>
    </main>
  );
}
