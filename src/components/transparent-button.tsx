import { ReactNode } from "react";

export default function TransparentButton({
    children,
    onClick,
}: {
    children: ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center text-xl rounded-full p-4 shadow-lg transition-colors duration-300 hover:bg-white/5 active:bg-purple-700/20 hover:text-white/50"
        >
            {children}
        </button>
    );
}
