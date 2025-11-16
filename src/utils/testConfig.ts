const testAIType = (parsed: any): boolean | AIConfigType => {
    let newConfig = {} as AIConfigType;
    if('baseURL' in parsed && typeof parsed.baseURL === 'string'){
        newConfig.baseURL = parsed.baseURL;
    } else {return false;};
    if('key' in parsed && typeof parsed.key === 'string'){
        newConfig.key = parsed.key;
    } else {return false;};
    if('model' in parsed && typeof parsed.model === 'string'){
        newConfig.model = parsed.model;
    } else {return false;};
    if(parsed.temperature && typeof parsed.temperature === 'number' && parsed.temperature >= 0 && parsed.temperature <= 1){
        newConfig.temperature = parsed.temperature;
    } else {return false;};
    if(parsed.thinkingControl && typeof parsed.thinkingControl === 'string' && ['none','qwen3_no_think' ,'gemini_low','gemini_none','oai_minimal','oai_low'].includes(parsed.thinkingControl)){
        newConfig.thinkingControl = parsed.thinkingControl;
    } else {return false;};
    return newConfig;
};

export const testPfr = (parsed: any): false | string[] => {
    let newPfr = [] as string[];
    if(parsed && Array.isArray(parsed) 
        && (parsed.length == 0 || parsed.every((item: any)=>{return typeof item === 'string';}))
    ){newPfr = parsed;} else {return false;};
    return newPfr;
};

export const testImporting = (text: string): false | configType => {
    let parsed = '' as any;
    try{
        parsed = JSON.parse(text);
    } catch (error) {
        return false;
    };
    if(!parsed || typeof parsed !== 'object'){return false;};
    let newConfig = {} as configType;
    newConfig.preferences = {
        article: [],
        comments: []
    };
    if(parsed.theme && ['light', 'dark', 'auto'].includes(parsed.theme)){
        newConfig.theme = parsed.theme;
    } else {return false;};
    if(parsed.lang && ['zh-CN', 'en'].includes(parsed.lang)){
        newConfig.lang = parsed.lang;
    } else {return false;};
    if(parsed.analyzeAI && typeof parsed.analyzeAI === 'object'){
        let test = testAIType(parsed.analyzeAI);
        if(test !== false && typeof test === 'object'){
            newConfig.analyzeAI = test;
        } else {return false;};
    } else {return false;};
    if(parsed.titlesAI && typeof parsed.titlesAI === 'object'){
        let test = testAIType(parsed.titlesAI);
        if(test !== false && typeof test === 'object'){
            newConfig.titlesAI = test;
        } else {return false;};
    } else {return false;};
    if(parsed.articleAI && typeof parsed.articleAI === 'object'){
        let test = testAIType(parsed.articleAI);
        if(test !== false && typeof test === 'object'){
            newConfig.articleAI = test;
        } else {return false;};
    } else {return false;};
    if(parsed.commentsAI && typeof parsed.commentsAI === 'object'){
        let test = testAIType(parsed.commentsAI);
        if(test !== false && typeof test === 'object'){
            newConfig.commentsAI = test;
        } else {return false;};
    } else {return false;};
    if(parsed.prompts && typeof parsed.prompts === 'object'){
        newConfig.prompts = {} as any;
        if(parsed.prompts['zh-CN'] && typeof parsed.prompts['zh-CN'] === 'object'){
            newConfig.prompts['zh-CN'] = {} as any;
            if(parsed.prompts['zh-CN'].analyze && typeof parsed.prompts['zh-CN'].analyze === 'string'){
                newConfig.prompts['zh-CN'].analyze = parsed.prompts['zh-CN'].analyze;
            } else {return false;};
            if(parsed.prompts['zh-CN'].titles && typeof parsed.prompts['zh-CN'].titles === 'string'){
                newConfig.prompts['zh-CN'].titles = parsed.prompts['zh-CN'].titles;
            } else {return false;};
            if(parsed.prompts['zh-CN'].article && typeof parsed.prompts['zh-CN'].article === 'string'){
                newConfig.prompts['zh-CN'].article = parsed.prompts['zh-CN'].article
            } else {return false;};
            if(parsed.prompts['zh-CN'].comments && typeof parsed.prompts['zh-CN'].comments === 'string'){
                newConfig.prompts['zh-CN'].comments = parsed.prompts['zh-CN'].comments;
            } else {return false;};
        } else {return false;};
        if(parsed.prompts['en'] && typeof parsed.prompts['en'] === 'object'){
            newConfig.prompts['en'] = {} as any;
            if(parsed.prompts['en'].analyze && typeof parsed.prompts['en'].analyze === 'string'){
                newConfig.prompts['en'].analyze = parsed.prompts['en'].analyze;
            } else {return false;};
            if(parsed.prompts['en'].titles && typeof parsed.prompts['en'].titles === 'string'){
                newConfig.prompts['en'].titles = parsed.prompts['en'].titles;
            } else {return false;};
            if(parsed.prompts['en'].article && typeof parsed.prompts['en'].article === 'string'){
                newConfig.prompts['en'].article = parsed.prompts['en'].article
            } else {return false;};
            if(parsed.prompts['en'].comments && typeof parsed.prompts['en'].comments === 'string'){
                newConfig.prompts['en'].comments = parsed.prompts['en'].comments;
            } else {return false;};
        } else {return false;};
    } else {return false;};
    let tempvar = testPfr(parsed.preferences.article);
    if(tempvar !== false){newConfig.preferences.article = tempvar;} else {return false;}
    tempvar = testPfr(parsed.preferences.comments);
    if(tempvar !== false){newConfig.preferences.comments = tempvar;} else {return false;}
    return newConfig;
};
