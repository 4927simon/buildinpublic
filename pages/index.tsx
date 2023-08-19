/* eslint-disable jsx-a11y/anchor-is-valid */
import { readFileSync } from 'fs';
import { join } from 'path';
import Head from 'next/head';
import Script from 'next/script';
import { ComponentProps, useContext, useEffect, useState } from 'react';
import { Reactions } from '../lib/reactions';
import { IComment, IReactionGroups } from '../lib/types/adapter';
import { renderMarkdown } from '../services/github/markdown';
import { getAppAccessToken } from '../services/github/getAppAccessToken';
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
  const path = join(process.cwd(), `README.md`);
  const readme = readFileSync(path, 'utf-8');
  const contents = readme.split('<!-- configuration -->');

  const token = await getAppAccessToken('giscus/giscus').catch(() => '');
  const [contentBefore, contentAfter] = await Promise.all(
    contents.map((section) => renderMarkdown(section, token, 'giscus/giscus')),
  );

  const comment: IComment = {
    author: {
      avatarUrl: 'https://avatars.githubusercontent.com/u/26596636?v=4',
      login: '4927simon',
      url: 'https://github.com/4927simon/buildinpublic',
    },
    authorAssociation: 'APP',
    bodyHTML: contentBefore,
    createdAt: '2023-08-19T13:21:14Z',
    deletedAt: null,
    id: 'onboarding',
    isMinimized: false,
    lastEditedAt: null,
    reactions: Object.keys(Reactions).reduce((prev, key) => {
      prev[key] = { count: 0, viewerHasReacted: false };
      return prev;
    }, {}) as IReactionGroups,
    replies: [],
    replyCount: 0,
    upvoteCount: 0,
    url: 'https://github.com/4927simon/buildinpublic',
    viewerDidAuthor: false,
    viewerHasUpvoted: false,
    viewerCanUpvote: false,
  };

  return {
    props: {
      comment,
      contentAfter,
      locale: locale as AvailableLanguage,
    },
  };
}

type DirectConfig = ComponentProps<typeof Configuration>['directConfig'];
//type DirectConfigHandler = ComponentProps<typeof Configuration>['onDirectConfigChange'];

export default function Home({
  //comment,
  //contentAfter,
  locale,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [directConfig] = useState<DirectConfig>({
    theme: 'preferred_color_scheme',
    themeUrl: `${env.app_host}/themes/custom_example.css`,
    reactionsEnabled: true,
    emitMetadata: false,
    lang: locale,
    inputPosition: 'bottom',
  });
  const themeUrl = useDebounce(directConfig.themeUrl);
  const configTheme = getThemeUrl(directConfig.theme, themeUrl);

  //const handleDirectConfigChange: DirectConfigHandler = (key, value) =>
  //setDirectConfig({ ...directConfig, [key]: value });

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
        <title>Build in public | #buildinpublic</title>
        <meta name="giscus:backlink" content={env.app_host} />
      </Head>

      <section className="py-10 bg-white sm:pt-16">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 -mr-6 overflow-hidden bg-gray-300 rounded-full">
                <img
                  className="object-cover w-full h-full"
                  src="https://cdn.rareblocks.xyz/collection/celebration/images/cta/2/female-avatar-1.jpg"
                  alt=""
                />
              </div>

              <div className="relative overflow-hidden bg-gray-300 border-4 border-white rounded-full w-28 h-28">
                <img
                  className="object-cover w-full h-full"
                  src="https://cdn.rareblocks.xyz/collection/celebration/images/cta/2/male-avatar-1.jpg"
                  alt=""
                />
              </div>

              <div className="w-20 h-20 -ml-6 overflow-hidden bg-gray-300 rounded-full">
                <img
                  className="object-cover w-full h-full"
                  src="https://cdn.rareblocks.xyz/collection/celebration/images/cta/2/female-avatar-2.jpg"
                  alt=""
                />
              </div>
            </div>

            <h2 className="mt-8 text-3xl font-bold leading-tight text-black lg:mt-12 sm:text-4xl lg:text-5xl">
              Join <span className="border-b-8 border-yellow-300">14,752</span> other makers
              building in public
            </h2>
          </div>
        </div>
      </section>

      <div className="color-text-primary w-full max-w-3xl mx-auto p-2 mb-24">
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
