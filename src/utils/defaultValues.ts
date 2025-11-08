import { defaultPrompts } from "./defaultPrompts";

export const defaultConfig = {
    theme: "auto",
    lang: navigator.languages[0]?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en',
    defaultAI: {
        baseURL: "",
        key: "",
        model: "",
        thinkingControl: "none"
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