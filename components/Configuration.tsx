import { CheckIcon, CopyIcon } from '@primer/octicons-react';
import { useEffect, useState } from 'react';
import { handleClipboardCopy } from '../lib/adapter';
import { useDebounce } from '../lib/hooks';
import {
  AvailableLanguage,
  //availableLanguages,
  //ConfigI18n,
  Trans,
  useGiscusTranslation,
} from '../lib/i18n';
import { InputPosition } from '../lib/types/giscus';
import { normalizeRepoName } from '../lib/utils';
import { env, Theme } from '../lib/variables';

interface IDirectConfig {
  theme: Theme;
  themeUrl: Theme;
  reactionsEnabled: boolean;
  emitMetadata: boolean;
  inputPosition: InputPosition;
  lang: AvailableLanguage;
}

interface IConfigurationProps {
  directConfig: IDirectConfig;
  onDirectConfigChange: (
    key: keyof IDirectConfig,
    value: IDirectConfig[keyof IDirectConfig],
  ) => void;
}

type Mapping = 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';

interface IConfig {
  repository: string;
  repositoryId: string;
  mapping: Mapping;
  term: string;
  category: string;
  categoryId: string;
  strict: boolean;
  useCategory: boolean;
  lazyLoad: boolean;
}

function ClipboardCopy() {
  const { t } = useGiscusTranslation('config');
  return (
    <div className="zeroclipboard-container position-absolute right-0 top-0">
      <button
        aria-label={t('copy')}
        className="ClipboardButton btn js-clipboard-copy tooltipped-no-delay m-2 p-0"
        data-copy-feedback="Copied!"
        tabIndex={0}
        onClick={handleClipboardCopy}
      >
        <CopyIcon className="octicon octicon-copy js-clipboard-copy-icon m-2" />
        <CheckIcon className="octicon octicon-check js-clipboard-check-icon color-text-success d-none m-2" />
      </button>
    </div>
  );
}

export default function Configuration({ directConfig }: IConfigurationProps) {
  const [config] = useState<IConfig>({
    repository: '',
    repositoryId: '',
    mapping: 'pathname',
    term: '',
    category: '',
    categoryId: '',
    strict: false,
    useCategory: true,
    lazyLoad: false,
  });

  const dRepository = normalizeRepoName(useDebounce(config.repository));
  const { t, dir } = useGiscusTranslation('config');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (!(typeof data === 'object' && data?.giscus?.discussion)) return;
      console.log(data);
    };

    if (directConfig.emitMetadata) {
      window.addEventListener('message', handleMessage);
    }
    return () => window.removeEventListener('message', handleMessage);
  }, [directConfig.emitMetadata]);

  return (
    <div dir={dir} className="markdown p-4 pt-0">
      <div dir="ltr" className="highlight highlight-text-html-basic relative">
        <pre>
          <span className="pl-kos">{'<'}</span>
          <span className="pl-ent">script</span> <span className="pl-c1">src</span>={'"'}
          <span className="pl-s">{env.app_host}/client.js</span>
          {'"\n        '}
          <span className="pl-c1">data-repo</span>={'"'}
          <span className="pl-s">{dRepository || t('[enterRepoHere]')}</span>
          {'"\n        '}
          <span className="pl-c1">data-repo-id</span>={'"'}
          <span className="pl-s">{config.repositoryId || t('[enterRepoIDHere]')}</span>
          {'"\n        '}
          {config.mapping !== 'number' ? (
            <>
              {config.useCategory ? (
                <>
                  <span className="pl-c1">data-category</span>={'"'}
                  <span className="pl-s">{config.category || t('[enterCategoryHere]')}</span>
                  {'"\n        '}
                </>
              ) : null}
              <span className="pl-c1">data-category-id</span>={'"'}
              <span className="pl-s">{config.categoryId || t('[enterCategoryIDHere]')}</span>
              {'"\n        '}
            </>
          ) : null}
          <span className="pl-c1">data-mapping</span>={'"'}
          <span className="pl-s">{config.mapping}</span>
          {'"\n        '}
          {['specific', 'number'].includes(config.mapping) ? (
            <>
              <span className="pl-c1">data-term</span>={'"'}
              <span className="pl-s">
                {config.term ||
                  (config.mapping === 'number' ? t('[enterNumberHere]') : t('[enterTermHere]'))}
              </span>
              {'"\n        '}
            </>
          ) : null}
          {config.mapping !== 'number' ? (
            <>
              <span className="pl-c1">data-strict</span>={'"'}
              <span className="pl-s">{Number(config.strict)}</span>
              {'"\n        '}
            </>
          ) : null}
          <span className="pl-c1">data-reactions-enabled</span>={'"'}
          <span className="pl-s">{Number(directConfig.reactionsEnabled)}</span>
          {'"\n        '}
          <span className="pl-c1">data-emit-metadata</span>={'"'}
          <span className="pl-s">{Number(directConfig.emitMetadata)}</span>
          {'"\n        '}
          <span className="pl-c1">data-input-position</span>={'"'}
          <span className="pl-s">{directConfig.inputPosition}</span>
          {'"\n        '}
          <span className="pl-c1">data-theme</span>={'"'}
          <span className="pl-s">
            {directConfig.theme === 'custom'
              ? directConfig.themeUrl || t('[enterThemeCSSURLHere]')
              : directConfig.theme}
          </span>
          {'"\n        '}
          <span className="pl-c1">data-lang</span>={'"'}
          <span className="pl-s">{directConfig.lang}</span>
          {'"\n        '}
          {config.lazyLoad ? (
            <>
              <span className="pl-c1">data-loading</span>={'"'}
              <span className="pl-s">lazy</span>
              {'"\n        '}
            </>
          ) : null}
          <span className="pl-c1">crossorigin</span>={'"'}
          <span className="pl-s">anonymous</span>
          {'"\n        '}
          <span className="pl-c1">async</span>
          <span className="pl-kos">{'>'}</span>
          {'\n'}
          <span className="pl-kos">{'<'}/</span>
          <span className="pl-ent">script</span>
          <span className="pl-kos">{'>'}</span>
        </pre>
        <ClipboardCopy />
      </div>
      <p>
        <Trans i18nKey="config:youCanCustomizeTheLayout" />
      </p>
    </div>
  );
}
