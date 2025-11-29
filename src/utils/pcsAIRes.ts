export function pcsAnlayze(input: any, old: prefType): prefType {
    let pref: prefType = { ...old };
    if(input.article){
        if(input.article.modify 
            && Array.isArray(input.article.modify) 
            && input.article.modify.length > 0 
            && input.article.modify.every((x: any) => 
                typeof x[0] == 'number' && typeof x[1] == 'string'
            )
        ){
            for(let i = 0; i < input.article.modify.length; i++){
                const [index, newValue] = input.article.modify[i];
                if(index >= 0 && index < pref.article.length) {
                    pref.article[index] = newValue;
                };
            };
        };
        if(input.article.remove
            && Array.isArray(input.article.remove)
            && input.article.remove.length > 0
            && input.article.remove.every((x: any) => typeof x == 'number')
        ){
            pref.article = pref.article.filter((x: any, i: number) => !input.article.remove.includes(i));
        };
        if(input.article.add
            && Array.isArray(input.article.add)
            && input.article.add.length > 0
            && input.article.add.every((x: any) => typeof x == 'string')
        ){
            pref.article = pref.article.concat(input.article.add);
        };
    };
    if(input.comments){
        if(input.comments.modify 
            && Array.isArray(input.comments.modify) 
            && input.comments.modify.length > 0 
            && input.comments.modify.every((x: any) => 
                typeof x[0] == 'number' && typeof x[1] == 'string'
            )
        ){
            for(let i = 0; i < input.comments.modify.length; i++){
                const [index, newValue] = input.comments.modify[i];
                if(index >= 0 && index < pref.comments.length) {
                    pref.comments[index] = newValue;
                };
            };
        };
        if(input.comments.remove
            && Array.isArray(input.comments.remove)
            && input.comments.remove.length > 0
            && input.comments.remove.every((x: any) => typeof x == 'number')
        ){
            pref.comments = pref.comments.filter((x: any, i: number) => !input.comments.remove.includes(i));
        };
        if(input.comments.add
            && Array.isArray(input.comments.add)
            && input.comments.add.length > 0
            && input.comments.add.every((x: any) => typeof x == 'string')
        ){
            pref.comments = pref.comments.concat(input.comments.add);
        };
    };
    return pref;
};


export function pcsComments(input: any): commentType[] {
    let comments: commentType[] = [];
    if(Array.isArray(input) && input.length > 0){
        for(let i = 0; i < input.length; i++){
            if(!input[i].content){
                continue;
            };
            let comment: commentType = {
                username: input[i].username ? input[i].username : 'Anonymous',
                content: input[i].content,
                like: 0
            };
            comments.push(comment);
        };
    };
    return comments;
};

export function pcsTitles(input: any): feedsType {
    let feeds: feedsType = {analyzed: true, feeds: null};
    if(Array.isArray(input) && input.length > 0){
        for(let i = 0; i < input.length; i++){
            if(!input[i].title){
                continue;
            };
            let feed: feedType = {
                title: input[i].title,
                author: input[i].author ? input[i].author : 'Anonymous',
                overview: input[i].overview ? input[i].overview : '',
                article: null,
                comments: null,
                like: 0
            };
            feeds.feeds = feeds.feeds ? feeds.feeds.concat(feed) : [feed];
        };
    };
    if(feeds.feeds && feeds.feeds?.length > 0){
        feeds.analyzed = false;
    };
    return feeds;
};