import { memo } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const components = {
    code({ inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: 0, borderRadius: 6 }}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code {...props} className={className}>
                {children}
            </code>
        );
    },
};

export const Markdown = memo(({ children }: { children: string }) => {
    return (
        <div
            className="markdown-body"
            style={{
                padding: 16,
                backgroundColor: 'transparent',
                color: 'inherit',
            }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
                components={components}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
});