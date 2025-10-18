import { useState, useEffect } from 'react';
import { FluentProvider, teamsLightTheme, teamsDarkTheme, Button } from '@fluentui/react-components';
import { defaultConfig } from './utils/defaultConfig';

export function App(){

    // config
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
    },[]);

    // darkmode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (event: MediaQueryListEvent) => {
            if(config.global.theme === 'auto'){
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
    const [isDark, setIsDark] = useState(config.global.theme === 'dark');
    useEffect(() => {
        if(config.global.theme === 'dark'){
            setIsDark(true);
        } else if(config.global.theme === 'light'){
            setIsDark(false);
        } else if(config.global.theme === 'auto'){
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
    }, [config.global.theme]);



    // main
    return (
        <FluentProvider
            theme={isDark ? teamsDarkTheme : teamsLightTheme}
            style={{ width: '100%', height: '100%' }}
        >
            <Button>Hello, world!</Button>
        </FluentProvider>
    );
};