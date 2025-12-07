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
            <Markdown>{`
## 4. Tables 表格

| Header1 表头1 | Header2 表头2 | Header3 表头3 |
|:--|:--:|--:|
| Left align 左对齐 | Center 居中 | Right align 右对齐 |
| Data 数据1 | Data 数据2 | Data 数据3 |

## 6. LaTeX

such as $E = mc^2$ or $A = \pi r^2$

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$
`}</Markdown>
        </DrawerBody>
    </Drawer>);
})