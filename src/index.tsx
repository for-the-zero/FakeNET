import { useState, useEffect } from 'react';
import { FluentProvider, webLightTheme, webDarkTheme,
    Button
} from '@fluentui/react-components';

import { defaultConfig } from './utils/defaultValues';
import { useTranslation } from 'react-i18next';

export function App(){

    // config
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    const [config, setConfig] = useState(defaultConfig);
    useEffect(() => {
        let ls = localStorage.getItem('fakenet');
        if(ls){
            let lsParsed = JSON.parse(ls) as configType;
            if(lsParsed){
                setConfig(lsParsed);
            }else{
                localStorage.removeItem('fakenet');
                localStorage.setItem('fakenet', JSON.stringify(config));
            };
        }else{
            localStorage.setItem('fakenet', JSON.stringify(config));
        };
        setIsConfigLoaded(true);
    },[]);
    useEffect(() => {
        localStorage.setItem('fakenet', JSON.stringify(config));
    }, [config]);

    // darkmode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (event: MediaQueryListEvent) => {
            if(config.theme === 'auto'){
                if(event.matches){
                    setIsDark(true);
                } else {
                    setIsDark(false);
                };
            };
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);
    const [isDark, setIsDark] = useState(config.theme === 'dark');
    useEffect(() => {
        if(config.theme === 'dark'){
            setIsDark(true);
        } else if(config.theme === 'light'){
            setIsDark(false);
        } else if(config.theme === 'auto'){
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
    }, [config.theme]);

    // i18n
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (isConfigLoaded) {
            let langToSet = config.lang;
            if (config.lang === 'auto') {
                langToSet = navigator.languages[0]?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
            };
            i18n.changeLanguage(langToSet);
        }
    }, [config.lang, isConfigLoaded, i18n]);


    // main
    return (
        <FluentProvider
            theme={isDark ? webDarkTheme : webLightTheme}
            style={{ width: '100%', height: '100%' }}
        >
            <Button>{t('test')}</Button>
        </FluentProvider>
    );
};