import { useState, useEffect, useId } from 'react';
import { FluentProvider, webLightTheme, webDarkTheme,
    Button, Title3, Text,
    Toaster, useToastController,
} from '@fluentui/react-components';
import { 
    ArrowCounterclockwiseRegular
} from '@fluentui/react-icons';

import { SetUI } from './components/settings';
import { ArticleTitle } from './components/atcCard';
import { AtcDrawer } from './components/atc';

import { defaultConfig, defaultFeeds } from './utils/defaultValues';
import { useTranslation } from 'react-i18next';

export function App(){
    // toast
    const toasterId = useId();
    const { dispatchToast } = useToastController(toasterId);

    // config
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    const [config, setConfig] = useState<configType>(defaultConfig);
    useEffect(() => {
        let ls = localStorage.getItem('fakenet');
        if(ls){
            try{
                const parsed = JSON.parse(ls) as configType;
                if(parsed){setConfig(parsed);};
            } catch {};
        } else {
            localStorage.setItem('fakenet', JSON.stringify(defaultConfig));
        };
        setIsConfigLoaded(true);
    }, []);
    useEffect(() => {
        if(isConfigLoaded){
            localStorage.setItem('fakenet', JSON.stringify(config));
        };
    }, [config, isConfigLoaded]);

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

    // flexible
    const [isNotNarSc, setIsNotNarSc] = useState(window.innerWidth > 600);
    useEffect(()=>{
        const handleResize = () => {
            setIsNotNarSc(window.innerWidth > 600);
        };
        window.addEventListener('resize', handleResize);
        return ()=>{window.removeEventListener('resize', handleResize)};
    }, []);

    // feed
    const [feeds, setFeeds] = useState<feedsType>(defaultFeeds);
    useEffect(() => {
        let ls = localStorage.getItem('fakenet_feeds');
        if(ls){
            try {
                const parsed = JSON.parse(ls) as feedsType;
                if(parsed){setFeeds(parsed);};
            } catch {};
        } else {
            localStorage.setItem('fakenet_feeds', JSON.stringify(defaultFeeds));
        };
    }, []);
    useEffect(() => {
        localStorage.setItem('fakenet_feeds', JSON.stringify(feeds));
    }, [feeds]);

    // refresh
    const [isReflashing, setIsReflashing] = useState(false);
    const refreshFeed = async() => {
        setIsReflashing(true);
        if(config.analyzeAI.baseURL === '' || config.analyzeAI.model === ''){
            //TODO: 跳过
        } else {
            //TODO:
        };
        if(config.titlesAI.baseURL === '' || config.titlesAI.model === ''){
            //TODO: 跳过
        } else {
            //TODO:
        };
        //TODO:
        setIsReflashing(false);
    };

    // open
    const [feedIndex, setFeedIndex] = useState<false | number>(false);


    // main
    return (
        <FluentProvider
            theme={isDark ? webDarkTheme : webLightTheme}
            style={{
                width: '100vw', minHeight: '100%', padding: '1rem', boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
        >
            <div style={{
                width: '100%',
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'
            }}>
                <Title3>{t('title')}</Title3>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                    <SetUI config={config} setConfig={setConfig} t={t} isNotNarSc={isNotNarSc} dispatchToast={dispatchToast} />
                    <Button appearance="primary" icon={<ArrowCounterclockwiseRegular />} onClick={refreshFeed}>
                        <Text weight="regular">
                            {t('refresh')}
                        </Text>
                    </Button>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                margin: '16px',
                boxSizing: 'border-box',
                width: 'calc(100% - 32px)',
                alignItems: 'center'
            }}>
                {feeds.feeds === null ? (<div>
                    <Text>{t('empty_feed')}</Text>
                </div>) : (feeds.feeds.map((feed, index) => (
                    <ArticleTitle 
                        key={index}
                        title={feed.title}
                        author={feed.author}
                        overview={feed.overview}
                        onClick={()=>{
                            setFeedIndex(index);
                        }}
                    />
                )))}

                <AtcDrawer feeds={feeds} setFeeds={setFeeds} feedIndex={feedIndex} config={config} t={t} onClose={()=>{
                    setFeedIndex(false);
                }} />

            </div>
            <Toaster toasterId={toasterId} />
        </FluentProvider>
    );
};