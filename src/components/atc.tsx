import {
    Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody,
    Button, Divider, Skeleton, SkeletonItem, Subtitle1, Card, Text, Spinner, Persona, 
    Toast, ToastTitle, ToastBody
} from "@fluentui/react-components";
import {
    Dismiss24Regular,
    ThumbLikeRegular, ThumbDislikeRegular, ThumbLikeFilled, ThumbDislikeFilled
} from "@fluentui/react-icons";
import { memo, useEffect, useEffectEvent, useState } from "react";
import type { Dispatch, SetStateAction, ReactNode } from 'react';

import { Markdown } from "./md";
import { getSvgDataUrl } from "./usrIcon";
import { Skeletons } from "./Skeletons";
import { reqAI } from "../utils/reqAI";
import { crtUsrComment, crtUsrArticle } from "../utils/crtUsrPmt";
import { pcsComments } from "../utils/pcsAIRes";

const Comment = memo(({ comment, onLikeChange }: {comment: commentType, onLikeChange: (like: -1 | 0 | 1)=>void})=>{
    return <Card appearance="outline">
        <Persona
            avatar={{image: {src: 
                getSvgDataUrl(comment.username)
            }}}
            name={comment.username}
        />
        <Text>{comment.content}</Text>
        <div style={{
            display: "flex",
            justifyContent: "flex-end"
        }}>
            <Button appearance="subtle" shape="circular" size="small" icon={comment.like === 1 ? <ThumbLikeFilled/> : <ThumbLikeRegular/>} onClick={()=>{
                onLikeChange(comment.like === 1 ? 0 : 1);
            }} />
            <Button appearance="subtle" shape="circular" size="small" icon={comment.like === -1 ? <ThumbDislikeFilled/> : <ThumbDislikeRegular/>} onClick={()=>{
                onLikeChange(comment.like === -1 ? 0 : -1);
            }}/>
        </div>
    </Card>;
});

export const AtcDrawer = memo(({feeds, feedIndex, setFeeds, reflashingTime, config, t, onClose, dispatchToast}: 
    {feeds: feedsType, setFeeds: Dispatch<SetStateAction<feedsType>>, feedIndex: number | false, reflashingTime: number, config: configType, t: (key: string)=>string, onClose: ()=>void, dispatchToast: (content: ReactNode, options?: any)=>void}
) => {

    const [requesting, setRequesting] = useState<{article: number[], comments: number[]}>({article: [], comments: []});
    useEffect(()=>{
        setRequesting({article: [], comments: []});
    },[reflashingTime]);
    const getNewestReflashingTime = useEffectEvent(()=>{
        return reflashingTime;
    });
    const reqArticle = async()=>{
        if(feeds.feeds && typeof feedIndex === 'number' && feeds.feeds[feedIndex]){
            let theReflashingTime = getNewestReflashingTime();
            let newestRequesting = requesting;
            let currentFeed = feeds.feeds[feedIndex];
            if(!currentFeed.article && !(requesting.article.includes(feedIndex))){
                if(config.articleAI.baseURL === '' || config.articleAI.model === ''){
                    dispatchToast(<Toast>
                        <ToastTitle>{t('reflash_noatc')}</ToastTitle>
                    </Toast>, {intent: 'error'});
                    return;
                };
                setRequesting(prev=> ({...prev, article: [...prev.article, feedIndex]}));
                let res = await reqAI(config.articleAI, {
                    sys: config.prompts[config.lang].article,
                    user: crtUsrArticle(config.lang, currentFeed, config.preferences.article),
                }, false);
                if(!res.error){
                    if(getNewestReflashingTime() === theReflashingTime){
                        setFeeds(prevFeeds => ({
                            ...prevFeeds,
                            feeds: prevFeeds.feeds?.map((feed, fIdx) =>
                                fIdx === feedIndex
                                ? { ...feed, article: res.result }
                                : feed
                            ) ?? null
                        }));
                        currentFeed = { ...currentFeed, article: res.result };
                        setRequesting((prev) => {
                            newestRequesting = {...prev, article: prev.article.filter(n => n !== feedIndex)};
                            return newestRequesting;
                        });
                    } else {
                        return;
                    };
                }else{
                    dispatchToast(<Toast>
                        <ToastTitle>{t('reflash_err')}</ToastTitle>
                        <ToastBody>{res.result}</ToastBody>
                    </Toast>, {intent: 'error'});
                    setRequesting((prev) => {
                        newestRequesting = {...prev, article: prev.article.filter(n => n !== feedIndex)};
                        return newestRequesting;
                    });
                    return;
                };
            };
            if(!currentFeed.comments && currentFeed.article && !(newestRequesting.comments.includes(feedIndex))){
                if(config.commentsAI.baseURL === '' || config.commentsAI.model === ''){
                    dispatchToast(<Toast>
                        <ToastTitle>{t('reflash_nocmt')}</ToastTitle>
                    </Toast>,{intent: 'error'});
                    return;
                };
                setRequesting(prev=> ({...prev, comments: [...prev.comments, feedIndex]}));
                let res = await reqAI(config.commentsAI, 
                    {sys: config.prompts[config.lang].comments,
                    user: crtUsrComment(config.lang, currentFeed, config.preferences.comments)},
                true);
                if(!res.error){ 
                    if(getNewestReflashingTime() === theReflashingTime){
                        setFeeds(prevFeeds => ({
                            ...prevFeeds,
                            feeds: prevFeeds.feeds?.map((feed, fIdx) =>
                                fIdx === feedIndex
                                ? { ...feed, comments: pcsComments(res.result) }
                                : feed
                            ) ?? null
                        }));
                        setRequesting(prev => ({...prev, comments: prev.comments.filter(n => n !== feedIndex)}));
                    };
                } else {
                    dispatchToast(<Toast> 
                        <ToastTitle>{t('reflash_err')}</ToastTitle>
                        <ToastBody>{res.result}</ToastBody>
                    </Toast>, {intent: 'error'});
                    setRequesting(prev => ({...prev, comments: prev.comments.filter(n => n !== feedIndex)}));
                };
            };
        };
    };
    useEffect(()=>{
        if(typeof feedIndex === 'number'){
            reqArticle();
        };
    }, [feedIndex]);

    return (<Drawer open={feedIndex !== false} size="full" position="end">
        <DrawerHeader>
            <DrawerHeaderTitle action={<Button appearance="subtle" icon={<Dismiss24Regular />} onClick={onClose} />}>{
                feeds.feeds && typeof feedIndex === 'number' && feeds.feeds[feedIndex] ? feeds.feeds[feedIndex].title : (<Skeletons isSingleLine={true} />)
            }</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
            {feedIndex !== false && feeds.feeds
                ? (<>
                    {feeds.feeds[feedIndex]?.article
                        ? (<>
                            <Markdown>{feeds.feeds[feedIndex].article}</Markdown>
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end"
                            }}>
                                <Button appearance="subtle" shape="circular" size="small" icon={feeds.feeds[feedIndex].like === 1 ? <ThumbLikeFilled/> : <ThumbLikeRegular/>} onClick={()=>{
                                    setFeeds(prevFeeds => ({
                                        ...prevFeeds,
                                        feeds: prevFeeds.feeds?.map((feed, fIdx) =>
                                            fIdx === feedIndex
                                            ? { ...feed, like: feed.like === 1 ? 0 : 1 }
                                            : feed
                                        ) ?? null
                                    }));
                                }} />
                                <Button appearance="subtle" shape="circular" size="small" icon={feeds.feeds[feedIndex].like === -1 ? <ThumbDislikeFilled/> : <ThumbDislikeRegular/>} onClick={()=>{
                                    setFeeds(prevFeeds => ({
                                        ...prevFeeds,
                                        feeds: prevFeeds.feeds?.map((feed, fIdx) =>
                                            fIdx === feedIndex
                                            ? { ...feed, like: feed.like === -1 ? 0 : -1 }
                                            : feed
                                        ) ?? null
                                    }));
                                }}/>
                            </div>
                        </>)
                        : (<Skeletons />)
                    }
                    <div style={{
                        margin: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: '10px'
                    }}>
                        {feeds.feeds[feedIndex]?.article
                            ? <>
                                <Divider />
                                <Subtitle1>{t('comment')}</Subtitle1>
                                {feeds.feeds[feedIndex]?.comments 
                                    ? feeds.feeds[feedIndex].comments.map((comment, i)=>{
                                        return <Comment 
                                            comment={comment} onLikeChange={(like) => {
                                                setFeeds(prevFeeds => ({...prevFeeds,
                                                    feeds: prevFeeds.feeds?.map((feed, fIdx) => 
                                                        fIdx === feedIndex ? {
                                                            ...feed,
                                                            comments: feed.comments?.map((c, cIdx) => 
                                                            cIdx === i ? { ...c, like } : c
                                                            ) ?? null
                                                        } : feed
                                                    ) ?? null
                                                }));
                                            }} 
                                        />;})
                                    : <Spinner size="huge" />
                                }
                            </>
                            : null
                        }
                        
                    </div>
                </>)
                : (<Skeletons />)
            }
        </DrawerBody>
    </Drawer>);
});