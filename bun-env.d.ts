interface AIConfigType {
    baseURL: string,
    key: string,
    model: string,
    thinkingControl: thinkingControl
    temperature: number
};
type thinkingControl = 'none'
    | 'qwen3_no_think'  // Qwen3   \no_think
    | 'gemini_low'      // Gemini  "reasoning_effort": "low"
    | 'gemini_none'     // Gemini  "reasoning_effort": "none"
    | 'oai_minimal'     // CloseAI "reasoning": {"effort": 'minimal'}
    | 'oai_low';        // CloseAI "reasoning": {"effort": 'low'}

interface prefType {
    article: string[],
    comments: string[]
};

interface configType {
    theme: 'auto' | 'light' | 'dark',
    lang: 'zh-CN' | 'en',
    analyzeAI: AIConfigType,
    titlesAI: AIConfigType,
    articleAI: AIConfigType,
    commentsAI: AIConfigType,
    prompts: {
        "zh-CN": {
            analyze: string,
            titles: string,
            article: string,
            comments: string
        },
        "en": {
            analyze: string,
            titles: string,
            article: string,
            comments: string
        }
    },
    preferences: prefType
};

//====================================

interface feedsType {
    analyzed: boolean,
    feeds: feedType[] | null;
};

interface feedType {
    title: string,
    overview: string,
    author: string,
    article: string | null,
    like: -1 | 0 | 1,
    comments: commentType[] | null,
};

interface commentType {
    username: string,
    content: string,
    like: -1 | 0 | 1
};