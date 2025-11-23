import { Card, CardHeader, Title3, Text, Body1 } from "@fluentui/react-components";
import { memo } from "react";
import { IconUser } from "./usrIcon";

export const ArticleTitle = memo(({title, author, overview, onClick}: {title: string; author: string; overview: string; onClick:()=>void}) => {
    
    return(
        <Card appearance='filled-alternative' style={{
            userSelect: 'none',
            width: 'calc(100% - 32px)',
            boxSizing: 'border-box',
        }} onClick={onClick}
        >
            <CardHeader 
                image={<IconUser name={author} />} 
                header={<Title3>{title}</Title3>}
                description={<Body1>{author}</Body1>}
            />
            <Text>{overview}</Text>
        </Card>
    );
});