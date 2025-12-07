import { memo } from 'react';
import { Divider, Text, Link } from "@fluentui/react-components";

import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

function CodeBlock({ node, inline, className, children, ...props }: any) {
    let isblock = String(children).includes('\n');
    let hasLanguageClass = className?.startsWith('language-');
    if (isblock || hasLanguageClass) {
        let match = /language-([\w:]+)/.exec(className || '');
        let language = match ? match[1] : 'plaintext';
        if (language === 'plaintext') {
            let code_content = String(children).replace(/\n$/, '');
            let detected = hljs.highlightAuto(code_content);
            language = detected.language || 'plaintext';
        };
        return (
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        );
    } else {
        return (
            <code
                {...props}
                className={className}
                style={{'padding': '1px','borderRadius': '3px', 'border': '1.5px solid gray'}}
            >
                {children}
            </code>
        );
    };
};

const markdownCpns = {
    strong: ({ children, ...props }: { children?: any } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <Text weight="bold" {...props}>{children}</Text>
    ),
    em: ({ children, ...props }: { children?: any } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <Text italic {...props}>{children}</Text>
    ),
    u: ({ children, ...props }: { children?: any } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <Text underline {...props}>{children}</Text>
    ),
    del: ({ children, ...props }: { children?: any } & React.HTMLAttributes<HTMLModElement>) => (
        <Text strikethrough {...props}>{children}</Text>
    ),
    hr: () => <Divider />,
    a: ({ children, href, ...props }: { children?: any, href?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <Link href={href || '#'} onClick={(e)=>{
            try{
                if(!href){return;};
                new URL(href);
                e.preventDefault();
                window.open(href, '_blank');
            }catch(e){};
        }} {...props}>{children}</Link>
    ),
    code: CodeBlock,
};

// TODO: remark-gfm remark-math rehype-katex katex github-markdown-css
export const Markdown = memo(({ children }: { children: string }) => {
    return (<MarkdownStyleContainer>
        <ReactMarkdown
            components={markdownCpns}
        >
            {children}
        </ReactMarkdown>
    </MarkdownStyleContainer>);
});

const MarkdownStyleContainer = styled.div`
blockquote{
    border-left: 5px solid gray;
    padding-left: 5px;
    margin-left: 0;
}
ul, ol{
    margin: 0;
    padding: 0;
    list-style: none;
}
ul li{
    position: relative;
    padding-left: 20px;
}
ul li::before{
    content: "•";
    position: absolute;
    left: 0;
    font-size: 16px;
    color: #666;
}
ol li{
    position: relative;
    padding-left: 25px;
}
ol li::before{
    content: counter(item) "."; 
    counter-increment: item;
    position: absolute;
    left: 0;
    color: #333;
    width: 20px;
    text-align: right;
    font-size: 15px;
}
p {
    margin-top: 7px;
    margin-bottom: 7px;
}
code{
    font-family: Consolas, Menlo, Monaco, "Andale Mono", "Ubuntu Mono", "Courier New", monospace;
}
pre{
    border-radius: 5px;
}
`;