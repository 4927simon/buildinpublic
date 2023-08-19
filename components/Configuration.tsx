import { CheckIcon, CopyIcon, SyncIcon, XIcon } from '@primer/octicons-react';
import { useEffect, useState } from 'react';
import { handleClipboardCopy } from '../lib/adapter';
import { useDebounce } from '../lib/hooks';
import {
  AvailableLanguage,
  availableLanguages,
  ConfigI18n,
  Trans,
  useGiscusTranslation,
} from '../lib/i18n';
import { ICategory } from '../lib/types/adapter';
import { InputPosition } from '../lib/types/giscus';
import { normalizeRepoName } from '../lib/utils';
import { availableThemes, env, Theme } from '../lib/variables';
import { getCategories } from '../services/giscus/categories';

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

const mappingOptions: Array<{
  value: Mapping;
  label: keyof ConfigI18n;
  description: keyof ConfigI18n;
}> = [
  {
    value: 'pathname',
    label: 'titleContainsPathname',
    description: 'titleContainsPathnameDesc',
  },
  {
    value: 'url',
    label: 'titleContainsURL',
    description: 'titleContainsURLDesc',
  },
  {
    value: 'title',
    label: 'titleContainsTitle',
    description: 'titleContainsTitleDesc',
  },
  {
    value: 'og:title',
    label: 'titleContainsOgTitle',
    description: 'titleContainsOgTitleDesc',
  },
  {
    value: 'specific',
    label: 'titleContainsSpecificTerm',
    description: 'titleContainsSpecificTermDesc',
  },
  {
    value: 'number',
    label: 'specificDiscussionNumber',
    description: 'specificDiscussionNumberDesc',
  },
];

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

export default function Configuration({ directConfig, onDirectConfigChange }: IConfigurationProps) {
  const [config, setConfig] = useState<IConfig>({
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
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const dRepository = normalizeRepoName(useDebounce(config.repository));
  const { t, dir } = useGiscusTranslation('config');

  useEffect(() => {
    setError(false);
    setConfig((current) => ({ ...current, repositoryId: '', category: '', categoryId: '' }));
    setCategories([]);
    if (dRepository) {
      getCategories(dRepository)
        .then(({ repositoryId, categories }) => {
          setConfig((current) => ({ ...current, repositoryId }));
          setCategories(categories);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [dRepository]);

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

  return null;
}
