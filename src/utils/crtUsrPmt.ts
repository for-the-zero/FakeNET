function crtPfr(pfr: string[], ordered: boolean): string{
    if(pfr.length == 0){return 'null';}
    return pfr.map((item, index) => `${ordered ? `${index + 1}.` : '-'} ${item}`).join('\n');
};

export function crtUsrAnalyze(lang: 'zh-CN' | 'en', feeds: feedsType, pfr: prefType): string{
    let text = '';
    if(feeds.feeds && feeds.feeds.length > 0){
        for(let i = 0; i < feeds.feeds.length; i++){
            let feed = feeds.feeds[i];
            if(!feed){continue;};
            text += `=====${lang === 'zh-CN' ? '文章' : 'Article'} ${i + 1}=====\n`;
            text += `${lang === 'zh-CN' ? '标题：' : 'Title:'} ${feed.title}\n`;
            text += `${lang === 'zh-CN' ? '作者：' : 'Author:'} ${feed.author}\n`;
            text += `${lang === 'zh-CN' ? '概览：' : 'Overview:'} ${feed.overview}\n`;
            text += `${lang === 'zh-CN' ? '已查看？' : 'Viewed: '} ${feed.article ? 'true' : 'false'}\n`;
            if(feed.article){
                text += `${lang === 'zh-CN' ? '反馈：' : 'Feedback'} ${(lang === 'zh-CN' ? ['点踩','无','点赞'] : ['Dislike','No Feedback','Like'])[feed.like + 1]}\n`;
                if(feed.comments && feed.comments.length > 0){
                    text += `===${lang === 'zh-CN' ? '评论' : 'Comments'}===\n`;
                    for(let j = 0; j < feed.comments.length; j++){
                        let comment = feed.comments[j];
                        if(!comment){continue;};
                        text += `- [${lang === 'zh-CN' ? '用户名:' : 'Username:'}${comment.username}] [${(lang === 'zh-CN' ? ['点踩','无反馈','点赞'] : ['Dislike','No Feedback','Like'])[comment.like + 1]}] ${comment.content}\n`;
                    };
                };
                text += `===${lang === 'zh-CN' ? '正文' : 'Content'}===\n`;
                text += feed.article;
                text += '\n\n';
            };
        };
        text += `=====${lang === 'zh-CN' ? '现在的用户偏好' : 'Current User Preferences'}=====\n`;
        text += lang === 'zh-CN' ? '文章偏好：' : 'Article Preferences:';
        text += crtPfr(pfr.article, true) + '\n';
        text += lang === 'zh-CN' ? '评论偏好：' : 'Comments Preferences:';
        text += crtPfr(pfr.comments, true) + '\n\n';
        text += lang === 'zh-CN' ? '根据以上数据，给出对偏好的修改' : 'Suggest changes based on the above data';
    };
    console.log(text);
    return text;
};

export function crtUsrComment(lang: 'zh-CN' | 'en', feed: feedType, pfr: string[]): string{
    let text = `==========${lang === 'zh-CN' ? '标题' : 'Title'}==========\n`;
    text += feed.title + '\n\n';
    text += `==========${lang === 'zh-CN' ? '正文' : 'Content'}==========\n`;
    text += feed.article + '\n\n';
    text += `==========${lang === 'zh-CN' ? '用户偏好' : 'User Preferences'}==========\n`;
    text += crtPfr(pfr, false) + '\n\n';
    text += `====================\n${lang === 'zh-CN' ? '请生成评论列表' : 'Please generate comments list'}`;
    console.log(text);
    return text;
};

export function crtUsrTitle(lang: 'zh-CN' | 'en', pfr: string[]): string{
    let text = lang === 'zh-CN' ? '以下是用户的相关的偏好列表：' : 'Relevant user preferences list:';
    text += '\n' + crtPfr(pfr, false) + '\n';
    text += '\n' + (lang === 'zh-CN' ? '请生成推送内容' : 'Please generate push content');
    console.log(text);
    return text;
};