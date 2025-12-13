import {
    Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody,
    Button, 
    Divider, Text, Link
} from "@fluentui/react-components";
import {
    Dismiss24Regular
} from "@fluentui/react-icons";
import { memo } from "react";

import { Markdown } from "./md";

export const AtcDrawer = memo(({feeds, feedIndex, config, onClose}: 
    {feeds: feedsType, feedIndex: number | false, config: configType, onClose: ()=>void}
) => {
    return (<Drawer open={feedIndex !== false} size="full" position="end">
        <DrawerHeader>
            <DrawerHeaderTitle action={<Button appearance="subtle" icon={<Dismiss24Regular />} onClick={onClose} />}>test</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
            <Markdown>{`114514`/*TODO:*/}</Markdown>
        </DrawerBody>
    </Drawer>);
})