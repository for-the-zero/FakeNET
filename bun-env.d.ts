interface AIConfigType {
    useGlobal: boolean,
    baseURL: string,
    key: string,
    model: string,
    thinkingControl: 'none' | 'prompt' | 'query'
};

interface configType {
    global: {
        theme: 'auto' | 'light' | 'dark',
        textAI: {
            baseURL: string,
            key: string,
            model: string,
            thinkingControl: 'none' | 'prompt' | 'query'
        }
    },
    fakecol: {
        analyzeAI: AIConfigType,
        titleAI: AIConfigType,
        articleAI: AIConfigType,
        commentAI: AIConfigType,
        usePic: boolean,
        picAI: AIConfigType,
    },
    fakepst: {
        analyzeAI: AIConfigType,
        postsAI: AIConfigType,
        picAI: AIConfigType,
    }
};