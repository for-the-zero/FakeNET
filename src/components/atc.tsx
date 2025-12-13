import {
    Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody,
    Button, Divider, Skeleton, SkeletonItem, Subtitle1, Card, CardHeader, Text, Spinner,
    Toast, ToastTitle, ToastBody
} from "@fluentui/react-components";
import {
    Dismiss24Regular,
    ThumbLikeRegular, ThumbDislikeRegular, ThumbLikeFilled, ThumbDislikeFilled
} from "@fluentui/react-icons";
import { memo, useEffect, useEffectEvent } from "react";
import type { Dispatch, SetStateAction, ReactNode } from 'react';

import { Markdown } from "./md";
import { IconUser } from "./usrIcon";
import { reqAI } from "../utils/reqAI";
import { crtUsrComment, crtUsrArticle } from "../utils/crtUsrPmt";
import { pcsComments } from "../utils/pcsAIRes";

const Comment = memo(({ comment, onLikeChange }: {comment: commentType, onLikeChange: (like: -1 | 0 | 1)=>void})=>{
    return <Card appearance="outline">
        <CardHeader
            image={<IconUser name={comment.username} />}
            header={<Subtitle1>{comment.username}</Subtitle1>}
        />
        <Text>{comment.content}</Text>
        <div style={{
            display: "flex",
            justifyContent: "flex-end"
        }}>
            <Button appearance="subtle" shape="circular" size="small" icon={comment.like === 1 ? <ThumbLikeFilled/> : <ThumbLikeRegular/>} onClick={()=>{
                onLikeChange(comment.like === 1 ? 0 : 1)
            }} />
            <Button appearance="subtle" shape="circular" size="small" icon={comment.like === -1 ? <ThumbDislikeFilled/> : <ThumbDislikeRegular/>} onClick={()=>{
                onLikeChange(comment.like === -1 ? 0 : -1)
            }}/>
        </div>
    </Card>;
});

export const AtcDrawer = memo(({feeds, feedIndex, setFeeds, reflashingTime, config, t, onClose, dispatchToast}: 
    {feeds: feedsType, setFeeds: Dispatch<SetStateAction<feedsType>>, feedIndex: number | false, reflashingTime: number, config: configType, t: (key: string)=>string, onClose: ()=>void, dispatchToast: (content: ReactNode, options?: any)=>void}
) => {

    const getNewestReflashingTime = useEffectEvent(()=>{
        return reflashingTime;
    });
    const reqArticle = async()=>{
        if(feeds.feeds && typeof feedIndex === 'number' && feeds.feeds[feedIndex]){
            if(!feeds.feeds[feedIndex].article){
                if(config.articleAI.baseURL === '' || config.articleAI.model === ''){
                    dispatchToast(<Toast>
                        <ToastTitle>{t('reflash_noatc')}</ToastTitle>
                    </Toast>, {intent: 'error'});
                    return;
                };
                let res = await reqAI(config.articleAI, {
                    sys: config.prompts[config.lang].article,
                    user: crtUsrArticle(config.lang, feeds.feeds[feedIndex], config.preferences.article),
                }, false);
                if(!res.error){
                    if(getNewestReflashingTime() === reflashingTime){
                        setFeeds(prevFeeds => ({
                            ...prevFeeds,
                            feeds: prevFeeds.feeds?.map((feed, fIdx) =>
                                fIdx === feedIndex
                                ? { ...feed, article: res.result }
                                : feed
                            ) ?? null
                        }));
                    };
                }else{
                    dispatchToast(<Toast>
                        <ToastTitle>{t('reflash_err')}</ToastTitle>
                        <ToastBody>{res.result}</ToastBody>
                    </Toast>, {intent: 'error'});
                };
            };
            if(!feeds.feeds[feedIndex].comments){
                if(config.commentsAI.baseURL === '' || config.commentsAI.model === ''){
                    dispatchToast(<Toast>
                        <ToastTitle>{t('reflash_nocmt')}</ToastTitle>
                    </Toast>,{intent: 'error'});
                    return;
                };
                let res = await reqAI(config.commentsAI, 
                    {sys: config.prompts[config.lang].comments,
                    user: crtUsrComment(config.lang, feeds.feeds[feedIndex], config.preferences.comments)},
                true);
                if(!res.error){ 
                    if(getNewestReflashingTime() === reflashingTime){
                        setFeeds(prevFeeds => ({
                            ...prevFeeds,
                            feeds: prevFeeds.feeds?.map((feed, fIdx) =>
                                fIdx === feedIndex
                                ? { ...feed, comments: pcsComments(res.result) }
                                : feed
                            ) ?? null
                        }));
                    };
                } else {
                    dispatchToast(<Toast> 
                        <ToastTitle>{t('reflash_err')}</ToastTitle>
                        <ToastBody>{res.result}</ToastBody>
                    </Toast>, {intent: 'error'});
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
                feeds.feeds && typeof feedIndex === 'number' && feeds.feeds[feedIndex] ? feeds.feeds[feedIndex].title : ''
            }</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
            {feedIndex !== false && feeds.feeds
                ? (<>
                    {feeds.feeds[feedIndex]?.article
                        ? (<Markdown>{feeds.feeds[feedIndex].article}</Markdown>)
                        : (<Skeleton style={{display: "block"}}>
                            {Array.from({length: 10 + Math.floor(Math.random() * 15)}, (_, i)=>{
                                return (<SkeletonItem style={{width: `${5 + Math.random() * 35}%`, display: "inline-block", marginRight: '20px', marginBottom: '10px'}} />);
                            })}
                        </Skeleton>)
                    }
                    <Divider />
                    <div style={{
                        margin: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: '10px'
                    }}>
                        {feeds.feeds[feedIndex]?.article
                            ? <>
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
                : (<Skeleton style={{display: "block"}}>
                        {Array.from({length: 10 + Math.floor(Math.random() * 100)}, (_, i)=>{
                            return (<SkeletonItem style={{width: `${5 + Math.random() * 35}%`, display: "inline-block", marginRight: '20px', marginBottom: '10px'}} />);
                        })}
                    </Skeleton>
                )
            }
        </DrawerBody>
    </Drawer>);
});