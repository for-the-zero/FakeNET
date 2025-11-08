import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
    Button, Text,
    Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent,
    Tab, TabList,
    Field, Radio, RadioGroup
} from '@fluentui/react-components';
import {
    SettingsRegular, Dismiss24Regular
} from '@fluentui/react-icons';


export function SetUI({config, setConfig, t}: {config: configType, setConfig: Dispatch<SetStateAction<configType>>, t: (key: string)=>string}){
    
    // tabs
    const [tab, setTab] = useState('app');

    // flexible
    const [isNotNarSc, setIsNotNarSc] = useState(window.innerWidth < 600);
    useEffect(()=>{
        const handleResize = () => {
            setIsNotNarSc(window.innerWidth > 600);
        };
        window.addEventListener('resize', handleResize);
    })

    return (<Dialog>
        <DialogTrigger disableButtonEnhancement>
            <Button icon={<SettingsRegular />} />
        </DialogTrigger>
        <DialogSurface>
            <DialogBody>
                <DialogTitle action={<DialogTrigger action="close">
                        <Button
                            appearance="subtle"
                            aria-label="close"
                            icon={<Dismiss24Regular />}
                        />
                    </DialogTrigger>} 
                >{t('settings')}</DialogTitle>
                <DialogContent style={{display: 'flex', flexDirection: isNotNarSc ? 'row' : "column", gap: '20px'}}>
                    <TabList selectedValue={tab} onTabSelect={(event, data: any)=>{setTab(data.value)}} vertical={isNotNarSc} appearance='subtle'>
                        <Tab value="app">{t('appset')}</Tab>
                        <Tab value="ai">{t('aiset')}</Tab>
                        <Tab value="pfr">{t('pfrset')}</Tab>
                        <Tab value="about">{t('about')}</Tab>
                    </TabList>
                    <div> 
                        {tab==='app' && (<div>
                            <Field label="语言 / Language">
                                <RadioGroup layout='horizontal' value={config.lang} onChange={(e,data)=>{
                                    setConfig({...config, lang: data.value as 'zh-CN' | 'en'});
                                }}>
                                    <Radio value='zh-CN' label='中文' />
                                    <Radio value='en' label='English' />
                                </RadioGroup>
                            </Field>
                            <Field label={t('appset_theme')}>
                                <RadioGroup layout='horizontal' value={config.theme} onChange={(e,data)=>{
                                    setConfig({...config, theme: data.value as 'light' | 'dark' | 'auto'});
                                }}>
                                    <Radio value='auto' label={t('appset_theme_auto')} />
                                    <Radio value='light' label={t('appset_theme_light')} />
                                    <Radio value='dark' label={t('appset_theme_dark')} />
                                </RadioGroup>
                            </Field>
                        </div>)}
                        {tab==='ai' && (<div>
                            {/* TODO: */}
                        </div>)}
                        {tab==='pfr' && (<div>Preferences</div>)}
                        {tab==='about' && (<div>About</div>)}
                    </div>
                </DialogContent>
            </DialogBody>
        </DialogSurface>
    </Dialog>)
};