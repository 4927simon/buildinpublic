import { useEffect } from 'react';
import {
  AvailableLanguage,
  //availableLanguages,
  //ConfigI18n,
  //Trans,
  useGiscusTranslation,
} from '../lib/i18n';
import { InputPosition } from '../lib/types/giscus';
//import { normalizeRepoName } from '../lib/utils';
import { Theme } from '../lib/variables';

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

export default function Configuration({ directConfig }: IConfigurationProps) {
  const { dir } = useGiscusTranslation('config');

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

  return <div dir={dir} className="markdown p-4 pt-0"></div>;
}
