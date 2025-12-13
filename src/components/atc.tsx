import {
    Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody,
    Button, Divider, Skeleton, SkeletonItem, Subtitle1, Card, CardHeader, Text, Spinner 
} from "@fluentui/react-components";
import {
    Dismiss24Regular,
    ThumbLikeRegular, ThumbDislikeRegular, ThumbLikeFilled, ThumbDislikeFilled
} from "@fluentui/react-icons";
import { memo } from "react";
import type { Dispatch, SetStateAction } from 'react';

import { Markdown } from "./md";
import { IconUser } from "./usrIcon";

const Comment = ({ comment, onLikeChange }: {comment: commentType, onLikeChange: (like: -1 | 0 | 1)=>void})=>{
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
};

export const AtcDrawer = memo(({feeds, feedIndex, setFeeds, config, t, onClose}: 
    {feeds: feedsType, setFeeds: Dispatch<SetStateAction<feedsType>>, feedIndex: number | false, config: configType, t: (key: string)=>string, onClose: ()=>void}
) => {

    // TODO:

    return (<Drawer open={feedIndex !== false} size="full" position="end">
        <DrawerHeader>
            <DrawerHeaderTitle action={<Button appearance="subtle" icon={<Dismiss24Regular />} onClick={onClose} />}>test</DrawerHeaderTitle>
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
                    </div>
                </>)
                : null
            }
        </DrawerBody>
    </Drawer>);
});