export const defaultPrompts = {
    "zh-CN": {
        analyze: require("./prompts/zh-CN/analyze.ts"),
        article: require("./prompts/zh-CN/article.ts"),
        comments: require("./prompts/zh-CN/comments.ts"),
        titles: require("./prompts/zh-CN/titles.ts")
    },
    "en": {
        analyze: require("./prompts/en/analyze.ts"),
        article: require("./prompts/en/article.ts"),
        comments: require("./prompts/en/comments.ts"),
        titles: require("./prompts/en/titles.ts")
    }
};

export const defaultConfig = {
    theme: "auto",
    lang: navigator.languages[0]?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en',
    analyzeAI: {
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    titlesAI: {
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    articleAI: {
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    commentsAI: {
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none",
        temperature: 0.7
    },
    prompts: defaultPrompts,
    preferences: {
        article: [],
        comments: []
    }
} as configType;

export const defaultFeeds = {
    analyzed: true,
    feeds: null,
} as feedsType;