import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function InternalLink(props: {
    children: ReactNode;
    to: string;
    gradient?: "to-rose-800" | "to-cyan-300" | "to-green-400" | "to-orange-300";
}) {
    return (
        <Link
            to={props.to}
            className={`bg-gradient-to-r from-blue-500 ${
                props.gradient ? props.gradient : "to-green-500"
            } bg-[length:300%_100%] bg-left hover:bg-right transition-all duration-300 text-transparent bg-clip-text`}
        >
            {props.children}
        </Link>
    );
}
