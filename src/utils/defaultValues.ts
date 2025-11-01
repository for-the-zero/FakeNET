export const defaultPrompts = {
    "zh-CN": {
        analyze: require("./prompts/zh-CN/analyze.md"),
        titles: require("./prompts/zh-CN/titles.md"),
        article: require("./prompts/zh-CN/article.md"),
        comments: require("./prompts/zh-CN/comments.md")
    },
    "en":{
        analyze: require("./prompts/en/analyze.md"),
        titles: require("./prompts/en/titles.md"),
        article: require("./prompts/en/article.md"),
        comments: require("./prompts/en/comments.md")
    }
};

export const defaultConfig = {
    theme: "auto",
    lang: "auto",
    defaultAI: {
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    analyzeAI: {
        useGlobal: true,
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    titlesAI: {
        useGlobal: true,
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    articleAI: {
        useGlobal: true,
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    commentsAI: {
        useGlobal: true,
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    prompts: defaultPrompts,
    preferences: {
        titles: [],
        article: [],
        comments: []
    }
} as configType;