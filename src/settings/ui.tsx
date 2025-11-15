import { useState, useEffect, useId } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
    Button, Text, InfoLabel,
    Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent,
    Tab, TabList,
    Field, Radio, RadioGroup, Input, Slider, Dropdown, Option, Textarea,
    Tooltip, Toaster, Toast, useToastController, ToastTitle,
    Divider 
} from '@fluentui/react-components';
import {
    SettingsRegular, Dismiss24Regular, SaveRegular, WarningRegular, CopyRegular, EyeRegular, EyeOffRegular, ArrowResetRegular
} from '@fluentui/react-icons';

import { testImporting } from '../utils/testConfig';
import { defaultConfig } from '../utils/defaultValues';
import { defaultPrompts } from '../utils/defaultPrompts';

function SetAI({label, aiConfig, onChange, t, prompt, onPmtChange, onPmtRst}: 
    {label: string, aiConfig: AIConfigType, onChange: (newConfig: AIConfigType)=>void, t: (key: string)=>string, prompt: string, onPmtChange: (newPmt: string)=>void, onPmtRst: ()=>void})
{
    const [baseURL, setBaseURL] = useState(aiConfig.baseURL);
    const [key, setKey] = useState(aiConfig.key);
    const [model, setModel] = useState(aiConfig.model);
    const [tptr, setTptr] = useState(aiConfig.temperature);
    const [tkMode, setTkMode] = useState(aiConfig.thinkingControl);
    const [sysPrompt, setSysPrompt] = useState(prompt);
    useEffect(()=>{
        setBaseURL(aiConfig.baseURL);
        setKey(aiConfig.key);
        setModel(aiConfig.model);
        setTptr(aiConfig.temperature);
        setTkMode(aiConfig.thinkingControl);
    }, [aiConfig]);
    useEffect(()=>{
        onChange({baseURL, key, model, temperature: tptr, thinkingControl: tkMode})
    },[baseURL, key, model, tptr, tkMode]);
    useEffect(()=>{
        setSysPrompt(prompt);
    },[prompt]);
    useEffect(()=>{
        onPmtChange(sysPrompt);
    },[sysPrompt]);

    const isURL = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch (e) {return false;};
    };

    const [showKey, setShowKey] = useState(false);

    return (<Field label={<Text weight='bold'>{label}</Text>} style={{gap: '8px'}}>
        <Field label={<InfoLabel info={t('aiset_baseurl_tip')}>
            <Text>{t('aiset_baseurl')}</Text>
        </InfoLabel>} orientation='horizontal' validationMessage={isURL(baseURL) ? undefined : t('aiset_baseurl_warn')}>
            <Input value={baseURL} onChange={(e,data)=>{setBaseURL(data.value)}} />
        </Field>
        <Field orientation='horizontal' label={t('aiset_key')}>
            <Input type={showKey ? 'text' : 'password'} value={key} onChange={(e,data)=>{setKey(data.value)}} contentAfter={
                <Tooltip content={t('aiset_key_tip')} relationship='description'>
                    <Button appearance='transparent' onClick={()=>{setShowKey(!showKey)}}
                        icon={showKey ? <EyeRegular /> : <EyeOffRegular />} />
                </Tooltip>
            } />
        </Field>
        <Field label={t('aiset_model')} orientation='horizontal'>
            <Input value={model} onChange={(e,data)=>{setModel(data.value)}} />
        </Field>
        <Field label={<InfoLabel info={t('aiset_tptr_tip')}>
            <Text>{t('aiset_tptr')} {tptr}</Text>
        </InfoLabel>} orientation='horizontal'>
            <Slider
                value={tptr} onChange={(e,data)=>{setTptr(data.value)}}
                min={0.00} max={1.00} step={0.05}
            />
        </Field>
        <Field label={t('aiset_tkmode')} orientation='horizontal'>
            <Dropdown value={tkMode} onOptionSelect={(e,data)=>{setTkMode(data.optionValue as "none" | "qwen3_no_think" | "gemini_low" | "gemini_none" | "oai_minimal" | "oai_low")}}>
                <Option value='none'>{t('aiset_tkmode_1')}</Option>
                <Option value='qwen3_no_think'>{t('aiset_tkmode_2')}</Option>
                <Option value='gemini_low'>{t('aiset_tkmode_3')}</Option>
                <Option value='gemini_none'>{t('aiset_tkmode_4')}</Option>
                <Option value='oai_minimal'>{t('aiset_tkmode_5')}</Option>
                <Option value='oai_low'>{t('aiset_tkmode_6')}</Option>
            </Dropdown>
        </Field>
        <Field label={<InfoLabel info={t('aiset_pmt_tip')}>{<Text weight='regular'>{t('aiset_pmt')}</Text>}</InfoLabel>} orientation='horizontal' size="small">
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px'}}>
                <Textarea style={{flex: 1, width: '100%'}} resize='vertical' 
                    value={sysPrompt} onChange={(e,data)=>{setSysPrompt(data.value)}}
                />
                <Tooltip content={t('aiset_pmt_reset')} relationship='description'> 
                    <Button appearance='subtle' icon={<ArrowResetRegular />} onClick={onPmtRst} />    
                </Tooltip>
            </div>
        </Field>
    </Field>);
};

export function SetUI({config, setConfig, t}: 
    {config: configType, setConfig: Dispatch<SetStateAction<configType>>, t: (key: string)=>string})
{
    // tabs
    const [tab, setTab] = useState('app');

    // flexible
    const [isNotNarSc, setIsNotNarSc] = useState(window.innerWidth > 600);
    useEffect(()=>{
        const handleResize = () => {
            setIsNotNarSc(window.innerWidth > 600);
        };
        window.addEventListener('resize', handleResize);
        return ()=>{window.removeEventListener('resize', handleResize)};
    }, []);

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
                            <Field label={<Text weight='bold'>{"语言 / Language"}</Text>}>
                                <RadioGroup layout='horizontal' value={config.lang} onChange={(e,data)=>{
                                    setConfig({...config, lang: data.value as 'zh-CN' | 'en'});
                                }}>
                                    <Radio value='zh-CN' label='中文' />
                                    <Radio value='en' label='English' />
                                </RadioGroup>
                            </Field>
                            <Field label={<Text weight='bold'>{t('appset_theme')}</Text>}>
                                <RadioGroup layout='horizontal' value={config.theme} onChange={(e,data)=>{
                                    setConfig({...config, theme: data.value as 'light' | 'dark' | 'auto'});
                                }}>
                                    <Radio value='auto' label={t('appset_theme_auto')} />
                                    <Radio value='light' label={t('appset_theme_light')} />
                                    <Radio value='dark' label={t('appset_theme_dark')} />
                                </RadioGroup>
                            </Field>
                            <Field label={<Text weight='bold'>{t('appset_port')}</Text>} style={{gap: '8px'}}>
                                <Field label={t('appset_import')} orientation='horizontal'>
                                    <div style={{display: 'flex', flexDirection: 'row', gap: '4px'}}>
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
                                    <Button icon={<CopyRegular />} onClick={()=>{
                                        navigator.clipboard.writeText(JSON.stringify(config));
                                        dispatchToast(<Toast><ToastTitle>
                                            {t('appset_export_success')}
                                        </ToastTitle></Toast>,{intent:'success'});
                                    }}><Text weight='regular'>{t('appset_export_btn')}</Text></Button>
                                </Field>
                            </Field>
                            <Field label={<Text weight='bold'>{t('appset_reset')}</Text>} >
                                <Button icon={<ArrowResetRegular />} onClick={()=>{
                                    setConfig(defaultConfig);
                                }}><Text weight='regular'>{t('appset_reset_tip')}</Text></Button>
                            </Field>
                        </div>)}
                        {tab==='ai' && (<div>
                            <SetAI label={t('aiset_titlesai')} t={t} aiConfig={config.titlesAI} onChange={(v)=>{
                                setConfig({...config, titlesAI: v});
                            }} prompt={config.prompts[config.lang].titles} onPmtChange={(v)=>{
                                setConfig({...config, prompts: {...config.prompts, [config.lang]: {...config.prompts[config.lang], titles: v}}})
                            }} onPmtRst={()=>{
                                setConfig({...config, prompts: {...config.prompts, [config.lang]: {...config.prompts[config.lang], titles: defaultConfig.prompts[config.lang].titles}}})
                            }} />
                            <Divider style={{marginTop: '8px', marginBottom: '8px'}} />
                            <SetAI label={t('aiset_articleai')} t={t} aiConfig={config.articleAI} onChange={(v)=>{
                                setConfig({...config, articleAI: v});
                            }} prompt={config.prompts[config.lang].article} onPmtChange={(v)=>{
                                setConfig({...config, prompts: {...config.prompts, [config.lang]: {...config.prompts[config.lang], article: v}}})
                            }} onPmtRst={()=>{
                                setConfig({...config, prompts: {...config.prompts, [config.lang]: {...config.prompts[config.lang], article: defaultConfig.prompts[config.lang].article}}})
                            }} />
                            {/* TODO: */}
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