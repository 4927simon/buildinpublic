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

      <section className="py-8 bg-white sm:pt-12 relative">
        <img
          className="img-fluid absolute top-4 left-4"
          src="/img/buildinpublic.svg"
          width="50"
          height="50"
          alt="Build in public"
        />

        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 -mr-6 overflow-hidden bg-gray-300 rounded-full">
                <img
                  className="object-cover w-full h-full"
                  src="/img/female-avatar-1.jpeg"
                  alt=""
                />
              </div>

              <div className="relative overflow-hidden bg-gray-300 border-4 border-white rounded-full w-28 h-28">
                <img className="object-cover w-full h-full" src="/img/male-avatar-1.jpeg" alt="" />
              </div>

              <div className="w-20 h-20 -ml-6 overflow-hidden bg-gray-300 rounded-full">
                <img
                  className="object-cover w-full h-full"
                  src="/img/female-avatar-2.jpeg"
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

      <div className="color-text-primary w-full max-w-3xl mx-auto p-2 mb-32 relative min-h-[140px] flex justify-center">
        <img
          className="img-fluid absolute top-28 -right-12 hidden lg:block"
          src="/img/shape.png"
          width="60"
          alt="shape"
        />
        <img
          className="img-fluid absolute -bottom-4 -left-12 hidden lg:block rotate-180"
          src="/img/shape.png"
          width="60"
          alt="shape"
        />
        <div id="comments" className="giscus relative w-full my-8">
          <div className="absolute top-12 left-[48%]">
            <div>
              <svg
                className="animate-spin h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <Script
          src="/client.js"
          data-repo="4927simon/buildinpublic"
          data-repo-id="R_kgDOKIz6vw"
          data-category="Announcements"
          data-category-id="DIC_kwDOKIz6v84CYtIM"
          data-mapping="pathname"
          data-strict="1"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="preferred_color_scheme"
          data-lang="en"
        />
      </div>

      {/*<section className="py-10 bg-white sm:py-16 lg:py-24">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              <span className="border-b-4 border-yellow-400">
                {' '}
                Trusted by 1200+ world class businesses{' '}
              </span>
            </h2>
          </div>

          <div className="flex mt-16 text-center justify-center">
            <div className="mx-auto lg:w-1/2">
              <div className="flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg
                  className="w-8 h-8 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg
                  className="w-8 h-8 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg
                  className="w-8 h-8 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg
                  className="w-8 h-8 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <blockquote className="mt-7">
                <p className="text-xl leading-relaxed text-gray-800">
                  “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam”
                </p>
              </blockquote>

              <img
                className="w-auto h-8 mx-auto mt-6 md:mt-10"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/6/trivago.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>*/}

      <section className="py-10 bg-white sm:pt-16 lg:pt-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-y-12 gap-x-8 xl:gap-x-12">
            <div className="col-span-2 md:col-span-6 xl:pr-8">
              <div className="flex items-center">
                <img
                  className="mr-2"
                  src="/img/buildinpublic.svg"
                  width="50"
                  height="50"
                  alt="Build in public"
                />
                <h4 className="font-bold text-2xl">Build in public</h4>
              </div>

              <p className="text-base leading-relaxed text-gray-600 mt-7 max-w-[370px]">
                Building in public (BIP) is the practice of sharing stories about how products or
                services were — and are — being developed, with the aim of inspiring and engaging
                with like-minded people.{' '}
              </p>
            </div>

            <div className="lg:col-span-2">
              <p className="text-base font-semibold text-gray-900">Case Studies</p>

              <ul className="mt-6 space-y-4">
                <li>
                  <a
                    href="#"
                    title=""
                    className="flex font-medium text-sm text-gray-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700"
                  >
                    {' '}
                    Soon
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <p className="text-base font-semibold text-gray-900">Resources</p>

              <ul className="mt-6 space-y-5">
                <li>
                  <a
                    href="#"
                    title=""
                    className="flex font-medium text-sm text-gray-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700"
                  >
                    {' '}
                    Soon
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <p className="text-base font-semibold text-gray-900">Other</p>

              <ul className="mt-6 space-y-5">
                <li>
                  <a
                    href="https://github.com/4927simon/buildinpublic/blob/813de4b651da3351d2f9d66cd3e17078589b9529/CODE_OF_CONDUCT.md"
                    title=""
                    className="flex font-medium text-sm text-gray-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700"
                  >
                    {' '}
                    Code of Conduct
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex font-medium text-sm text-gray-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700"
                  >
                    {' '}
                    Terms & Conditions{' '}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex font-medium text-sm text-gray-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700"
                  >
                    {' '}
                    Privacy Policy{' '}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="mt-16 mb-10 border-gray-200" />

          <div className="sm:flex sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">&copy; Build in public</p>
            <ul className="flex items-center mt-5 space-x-3 md:order-3 sm:mt-0">
              <li>
                <a
                  href="https://x.com/simonda1ey"
                  title="X"
                  className="flex items-center justify-center text-gray-800 transition-all duration-200 bg-transparent border border-gray-300 rounded-full w-7 h-7 focus:bg-yellow-300 hover:bg-yellow-300 hover:border-yellow-300 focus:border-yellow-300"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
