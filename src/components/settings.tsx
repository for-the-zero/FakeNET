import { useState, useEffect, memo } from 'react';
import type { Dispatch, SetStateAction, ReactNode } from 'react';
import {
    Button, Text, InfoLabel,
    Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent,
    Tab, TabList,
    Field, Radio, RadioGroup, Input, Slider, Dropdown, Option, Textarea,
    Tooltip, Toast, ToastTitle,
    Divider,
    Image,
    Title1, Body1
} from '@fluentui/react-components';
import {
    SettingsRegular, Dismiss24Regular, SaveRegular, WarningRegular, CopyRegular, EyeRegular, EyeOffRegular, ArrowResetRegular, DeleteRegular,
    HomePersonRegular, FluentRegular
} from '@fluentui/react-icons';

import { testImporting, testPfr } from '../utils/testConfig';
import { defaultConfig } from '../utils/defaultValues';

const SetAI = memo(function({label, aiConfig, onChange, t, prompt, onPmtChange, onPmtRst}: 
    {label: string, aiConfig: AIConfigType, onChange: (newConfig: AIConfigType)=>void, t: (key: string)=>string, prompt: string, onPmtChange: (newPmt: string)=>void, onPmtRst: ()=>void})
{
    const [showKey, setShowKey] = useState(false);

    const isURL = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch (e) {return false;};
    };

    return (<Field label={<Text weight='bold' size={400}>{label}</Text>} style={{gap: '8px'}}>
        <Field label={<InfoLabel info={t('aiset_baseurl_tip')}>
            <Text>{t('aiset_baseurl')}</Text>
        </InfoLabel>} orientation='horizontal' validationMessage={isURL(aiConfig.baseURL) ? undefined : t('aiset_baseurl_warn')}>
            <Input value={aiConfig.baseURL} onChange={(e,data)=>{
                onChange({...aiConfig, baseURL: data.value})
            }} />
        </Field>
        <Field orientation='horizontal' label={t('aiset_key')}>
            <Input type={showKey ? 'text' : 'password'} value={aiConfig.key} onChange={(e,data)=>{
                onChange({...aiConfig, key: data.value})
            }} contentAfter={
                <Tooltip content={t('aiset_key_tip')} relationship='description'>
                    <Button appearance='transparent' onClick={()=>{setShowKey(!showKey)}}
                        icon={showKey ? <EyeRegular /> : <EyeOffRegular />} />
                </Tooltip>
            } />
        </Field>
        <Field label={t('aiset_model')} orientation='horizontal'>
            <Input value={aiConfig.model} onChange={(e,data)=>{
                onChange({...aiConfig, model: data.value})
            }} />
        </Field>
        <Field label={<InfoLabel info={t('aiset_tptr_tip')}>
            <Text>{t('aiset_tptr')} {aiConfig.temperature}</Text>
        </InfoLabel>} orientation='horizontal'>
            <Slider
                value={aiConfig.temperature} onChange={(e,data)=>{
                    onChange({...aiConfig, temperature: data.value})
                }}
                min={0.00} max={1.00} step={0.05}
            />
        </Field>
        <Field label={t('aiset_tkmode')} orientation='horizontal'>
            <Dropdown value={aiConfig.thinkingControl} onOptionSelect={(e,data)=>{
                onChange({...aiConfig, thinkingControl: data.optionValue as "none" | "qwen3_no_think" | "gemini_low" | "gemini_none" | "oai_minimal" | "oai_low"})
            }}>
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
                    value={prompt} onChange={(e,data)=>{
                        onPmtChange(data.value)
                    }}
                />
                <Tooltip content={t('aiset_pmt_reset')} relationship='description'> 
                    <Button appearance='subtle' icon={<ArrowResetRegular />} onClick={onPmtRst} />    
                </Tooltip>
            </div>
        </Field>
    </Field>);
});

const SetPfr = memo(function({label, pfrConfig, onChange, t, dispatchToast}: 
    {label: string, pfrConfig: string[], onChange: (newConfig: string[])=>void, t: (key: string)=>string, dispatchToast: (content: ReactNode, options?: any)=>void})
{
    const [input , setInput] = useState('[]');
    const [isValid, setIsValid] = useState(true);
    useEffect(()=>{
        setInput(JSON.stringify(pfrConfig));
    }, [pfrConfig]);
    useEffect(()=>{
        let parsed: any;
        try{
            parsed = JSON.parse(input);
            if(testPfr(parsed)){
                setIsValid(true);
            } else {
                setIsValid(false);
            };
        } catch(e) {
            setIsValid(false);
        };
    }, [input]);
    
    return (<Field size='small'
        label={<Text weight='bold' size={400}>{label}</Text>} 
        validationMessage={isValid ? undefined : t('pfrset_tip2')}
        style={{display: 'flex', flexDirection: 'column', gap: '8px'}}
    >
        <div style={{display: 'flex', flexDirection: 'row', gap: '8px'}}>
            <Tooltip content={t('pfrset_reset')} relationship='description'>
                <Button icon={<ArrowResetRegular />} onClick={()=>{
                    setInput(JSON.stringify(pfrConfig));
                }} />
            </Tooltip>
            <Tooltip content={t('pfrset_clear')} relationship='description'>
                <Button icon={<DeleteRegular />} onClick={()=>{
                    setInput('[]');
                }} />
            </Tooltip>
            <Button icon={<SaveRegular />} appearance='primary' 
                disabled={!isValid || input === JSON.stringify(pfrConfig)} 
                onClick={()=>{
                    onChange(testPfr(JSON.parse(input)) as string[]);
                    dispatchToast(<Toast><ToastTitle>
                        {t('pfrset_save_success')}
                    </ToastTitle></Toast>,{intent:'success'});
                }}
            >
                <Text weight='regular'>{t('pfrset_save')}</Text>
            </Button>
        </div>
        <Textarea value={input} onChange={(e,data)=>{
            setInput(data.value);
        }} resize='vertical' />
    </Field>);
});

export const SetUI = memo(function({config, setConfig, t, isNotNarSc, dispatchToast}: 
    {config: configType, setConfig: Dispatch<SetStateAction<configType>>, t: (key: string)=>string, isNotNarSc: boolean, dispatchToast: (content: ReactNode, options?: any)=>void})
{
    // tabs
    const [tab, setTab] = useState('app');

    // import
    const [importing, setImporting] = useState('');
    const [isImportingValid, setIsImportingValid] = useState(false);
    useEffect(()=>{
        if(testImporting(importing)){setIsImportingValid(true);
        }else{setIsImportingValid(false);};
    }, [importing]);

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
                    <div style={{
                        maxHeight: 'calc(100vh - 150px)', overflowY: 'auto',
                        width: '100%', paddingRight: '16px'
                    }}> 
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
                            <Divider style={{marginTop: '8px', marginBottom: '8px'}} />
                            <SetAI label={t('aiset_commentsai')} t={t} aiConfig={config.commentsAI} onChange={(v)=>{
                                setConfig({...config, commentsAI: v});
                            }} prompt={config.prompts[config.lang].comments} onPmtChange={(v)=>{
                                setConfig({...config, prompts: {...config.prompts, [config.lang]: {...config.prompts[config.lang], comments: v}}})
                            }} onPmtRst={()=>{
                                setConfig({...config, prompts: {...config.prompts, [config.lang]: {...config.prompts[config.lang], comments: defaultConfig.prompts[config.lang].comments}}})
                            }} />
                            <Divider style={{marginTop: '8px', marginBottom: '8px'}} />
                            <SetAI label={t('aiset_analyzeai')} t={t} aiConfig={config.analyzeAI} onChange={(v)=>{
                                setConfig({...config, analyzeAI: v});
                            }} prompt={config.prompts[config.lang].analyze} onPmtChange={(v)=>{
                                setConfig({...config, prompts: {...config.prompts, [config.lang]: {...config.prompts[config.lang], analyze: v}}})
                            }} onPmtRst={()=>{
                                setConfig({...config, prompts: {...config.prompts, [config.lang]: {...config.prompts[config.lang], analyze: defaultConfig.prompts[config.lang].analyze}}})
                            }} />
                        </div>)}
                        {tab==='pfr' && (<div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <Text>{t('pfrset_tip1')}</Text>
                            <Divider />
                            <SetPfr label={t('pfrset_article')} pfrConfig={config.preferences.article} t={t} dispatchToast={dispatchToast} onChange={(v)=>{
                                setConfig({...config, preferences: {...config.preferences, article: v}});
                            }} />
                            <SetPfr label={t('pfrset_comment')} pfrConfig={config.preferences.comments} t={t} dispatchToast={dispatchToast} onChange={(v)=>{
                                setConfig({...config, preferences: {...config.preferences, comments: v}});
                            }} />
                        </div>)}
                        {tab==='about' && (<div style={{
                            display: 'flex', flexDirection: 'column', 
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Image src={require('../assets/favicon.svg')} height={100} />
                                <Title1>FakeNET</Title1>
                            </div>
                            <Body1>{t('about_t1')}</Body1>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '8px'
                            }}>
                                <Tooltip content={t('about_gh')} relationship='description' withArrow={true} positioning='below'>
                                    <Button icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
                                    } onClick={()=>{
                                        window.open('https://github.com/for-the-zero/FakeNET');
                                    }} />
                                </Tooltip>
                                <Tooltip content={t('about_me')} relationship='description' withArrow={true} positioning='below'>
                                    <Button icon={<HomePersonRegular />} onClick={()=>{
                                        window.open('https://ftz.is-a.dev/');
                                    }} />
                                </Tooltip>
                                <Tooltip content={t('about_uic')} relationship='description' withArrow={true} positioning='below'>
                                    <Button icon={<FluentRegular />} onClick={()=>{
                                        window.open('https://storybooks.fluentui.dev/react/?path=/docs/concepts-introduction--docs')
                                    }}/>
                                </Tooltip>
                            </div>
                        </div>)}
                    </div>
                </DialogContent>
            </DialogBody>
        </DialogSurface>
    </Dialog>)
});