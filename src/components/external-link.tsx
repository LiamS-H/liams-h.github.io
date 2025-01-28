import { ReactNode } from "react";

export default function ExternalLink(props: {
    children: ReactNode;
    href: string;
}) {
    return (
        <a
            target="_blank"
            href={props.href}
            className="bg-gradient-to-r from-pink-500 to-purple-500 bg-[length:200%_100%] bg-left hover:bg-right transition-all duration-300 text-transparent bg-clip-text"
            rel="noopener noreferrer"
        >
            {props.children}
        </a>
    );
}
