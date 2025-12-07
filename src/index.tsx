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
            let lsParsed = JSON.parse(ls) as feedsType;
            if(lsParsed){
                setFeeds(lsParsed);
            }else{
                localStorage.removeItem('fakenet_feeds');
                localStorage.setItem('fakenet_feeds', JSON.stringify(defaultFeeds))
            };
        } else {
            localStorage.setItem('fakenet_feeds', JSON.stringify(defaultFeeds));
        };
    }, []);
    useEffect(() => {
        localStorage.setItem('fakenet_feeds', JSON.stringify(feeds));
    }, [feeds]);

    // refresh
    const refreshFeed = () => {
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
    };


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
                            //TODO:
                        }}
                    />
                )))}

                {/* TODO:测试，一会删 */}
                <AtcDrawer feeds={{feeds: [{title: 'test', author: 'test', overview: 'test', article: null, like: 0, comments: null}], analyzed: true}} feedIndex={0} config={config} onClose={()=>{}} />

            </div>
            <Toaster toasterId={toasterId} />
        </FluentProvider>
    );
};