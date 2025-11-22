import { useState, useEffect } from 'react';
import { FluentProvider, webLightTheme, webDarkTheme,
    Button, Title3, Text
} from '@fluentui/react-components';
import { 
    ArrowCounterclockwiseRegular
} from '@fluentui/react-icons';

import { SetUI } from './components/settings';

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
            i18n.changeLanguage(config.lang);
        };
    }, [config.lang, isConfigLoaded, i18n]);


    // main
    return (
        <FluentProvider
            theme={isDark ? webDarkTheme : webLightTheme}
            style={{
                width: '100%', height: '100%', padding: '1rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
        >
            <div style={{
                width: '100%',
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'
            }}>
                <Title3>{t('title')}</Title3>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                    <SetUI config={config} setConfig={setConfig} t={t} />
                    <Button appearance="primary" icon={<ArrowCounterclockwiseRegular />}>
                        <Text weight="regular">
                            {t('refresh')}
                        </Text>
                    </Button>
                </div>
            </div>
        </FluentProvider>
    );
};