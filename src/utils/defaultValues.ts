import { defaultPrompts } from "./defaultPrompts";

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