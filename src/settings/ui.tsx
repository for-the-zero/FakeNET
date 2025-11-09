import { useState, useEffect, useId } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
    Button, Text,
    Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent,
    Tab, TabList,
    Field, Radio, RadioGroup, Input,
    Tooltip, Toaster, Toast, useToastController, ToastTitle
} from '@fluentui/react-components';
import {
    SettingsRegular, Dismiss24Regular, SaveRegular, WarningRegular
} from '@fluentui/react-icons';

import { testImporting } from '../utils/testConfig';


export function SetUI({config, setConfig, t}: {config: configType, setConfig: Dispatch<SetStateAction<configType>>, t: (key: string)=>string}){
    
    // tabs
    const [tab, setTab] = useState('app');

    // flexible
    const [isNotNarSc, setIsNotNarSc] = useState(window.innerWidth > 600);
    useEffect(()=>{
        const handleResize = () => {
            setIsNotNarSc(window.innerWidth > 600);
        };
        window.addEventListener('resize', handleResize);
    });

    // import
    const [importing, setImporting] = useState('');
    const [isImportingValid, setIsImportingValid] = useState(false);
    useEffect(()=>{
        if(testImporting(importing)){setIsImportingValid(true);
        }else{setIsImportingValid(false);};
    }, [importing]);

    // toast
    const toasterId = useId();
    const { dispatchToast } = useToastController(toasterId);
    

    return (<Dialog>
        <DialogTrigger disableButtonEnhancement>
            <Button icon={<SettingsRegular />} />
        </DialogTrigger>
        <DialogSurface>
            <DialogBody>
                <DialogTitle action={
                    <DialogTrigger action="close">
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
                            <Field label={t('appset_port')} style={{gap: '8px'}}>
                                <Field label={t('appset_import')} orientation='horizontal'>
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <Input value={importing} onChange={(e,data)=>{setImporting(data.value)}}
                                            contentAfter={!isImportingValid ? (
                                                <Tooltip content={t('appset_import_tip')} relationship="description">
                                                    <WarningRegular />
                                                </Tooltip>
                                            ) : null} 
                                        />
                                        <Button icon={<SaveRegular />} appearance='subtle' disabled={!isImportingValid} onClick={()=>{
                                            let test = testImporting(importing);
                                            if(test){
                                                setConfig(test);
                                            };
                                        }} />
                                    </div>
                                </Field>
                                <Field label={t('appset_export')} orientation='horizontal'>
                                    <Button onClick={()=>{
                                        navigator.clipboard.writeText(JSON.stringify(config));
                                        dispatchToast(<Toast><ToastTitle>
                                            {t('appset_export_success')}
                                        </ToastTitle></Toast>,{intent:'success'});
                                    }}><Text weight='regular'>{t('appset_export_btn')}</Text></Button>
                                </Field>
                            </Field>
                        </div>)}
                        {tab==='ai' && (<div>
                            <Field label="titleAI">
                                {/* TODO: */}
                            </Field>
                        </div>)}
                        {tab==='pfr' && (<div>Preferences</div>)}
                        {tab==='about' && (<div>About</div>)}
                    </div>
                    <Toaster toasterId={toasterId} />
                </DialogContent>
            </DialogBody>
        </DialogSurface>
    </Dialog>)
};