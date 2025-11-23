import { Avatar, type AvatarProps } from "@fluentui/react-components";
import { toSvg } from 'jdenticon';
import { useMemo } from 'react';

export function IconUser({ name, ...props }: { name: string } & AvatarProps) {
    const dataUrl = useMemo(() => {
        const svg = toSvg(name, 100);
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }, [name]);

    return (<Avatar image={{src: dataUrl}} size={36} {...props} />);
};