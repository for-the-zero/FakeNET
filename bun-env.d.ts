interface AIConfigType {
    useGlobal: boolean,
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

interface configType {
    theme: 'auto' | 'light' | 'dark',
    lang: 'auto' | 'zh-CN' | 'en',
    defaultAI: {
        baseURL: string,
        key: string,
        model: string,
        thinkingControl: thinkingControl,
    }
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
    preferences: {
        titles: string[],
        article: string[],
        comments: string[]
    }
};