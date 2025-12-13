export async function reqAI(ai: AIConfigType, prompts: {sys: string, user: string}, parseJSON: boolean): 
    Promise<{ result: string | any; error: boolean }>
{
    const cb = { result: null as string | any, error: false };

    // thinking control
    let extraBody = {};
    if(ai.thinkingControl === 'gemini_low'){
        extraBody = {"reasoning_effort": "low"};
    } else if (ai.thinkingControl === 'gemini_none') {
        extraBody = {"reasoning_effort": "none"};
    } else if (ai.thinkingControl === 'oai_low') {
        extraBody = {"reasoning": {"effort": 'low'}};
    } else if (ai.thinkingControl === 'oai_minimal') {
        extraBody = {"reasoning": {"effort": 'minimal'}};
    };

    try {
        // request
        let response = await fetch(ai.baseURL + '/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ai.key
            },
            body: JSON.stringify({
                model: ai.model,
                stream: false,
                messages:[
                    { role: 'system', content: prompts.sys },
                    { role: 'user', content: prompts.user + (ai.thinkingControl === 'qwen3_no_think' ? ' \\_no_think' : '')}
                ],
                temperature: ai.temperature,
                ...extraBody
            })
        });

        // error
        if (!response.ok) {
            let errorMsg = '';
            try {
                let errorData = await response.json();
                errorMsg = errorData?.error?.message || errorData?.message || `HTTP ${response.status} ${response.statusText}`;
            } catch {
                errorMsg = await response.text();
            };
            return {
                error: true,
                result: errorMsg
            };
        };
        let data: any;
        try {
            data = await response.json();
        } catch (parseError) {
            return {
                error: true,
                result: parseError instanceof Error ? parseError.message : String(parseError),
            };
        };
        
        // parse JSON
        if(data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content){
            let resText = data.choices[0].message.content as string;
            console.log(resText);
            if(parseJSON){
                let matches = [...resText.matchAll(/```(?:\S+)?\s*([\s\S]*?)```/g)];
                if(matches.length === 0){
                    return { result: 'Couldn\'t find JSON code block', error: true };
                };
                try {
                    let json = matches[matches.length - 1];
                    if(!json || !json[1]){
                        return { result: 'Couldn\'t find JSON code block', error: true };
                    };
                    let jsoned = json[1].trim();
                    if(!jsoned){return { result: 'Couldn\'t find JSON code block', error: true };};
                    console.log(jsoned);
                    cb.result = JSON.parse(jsoned);
                    console.log(cb.result);
                } catch (parseError) { 
                    return { result: parseError instanceof Error ? parseError.message : String(parseError), error: true };
                };
            } else {
                cb.result = resText.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
                console.log(cb.result);
            };
        } else {
            return { result: 'Invalid response', error: true };
        };

    // error
    } catch (error: any) {
        let message = '';
        if (error instanceof TypeError) {
            if (error.message === 'Failed to fetch' || /networkerror/i.test(error.message)) {
                message = 'Couldn\'t connect to the server';
            } else if (/cors/i.test(error.message)) {
                message = 'CORS blocked';
            } else {
                message = `Browser network error: ${error.message}`;
            };
        } else if (error?.status) {
            switch (error.status) {
                case 401: message = '401 Invalid or expired API key.'; break;
                case 403: message = '403 Access denied.'; break;
                case 429: message = '429 Too many requests.'; break;
                default:  message = `Service error (HTTP ${error.status}).`;
            };
        } else if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        } else {
            message = 'Unknown error. Please retry or contact support.';
        };
        return { result: message, error: true };
    };
    return cb;
};