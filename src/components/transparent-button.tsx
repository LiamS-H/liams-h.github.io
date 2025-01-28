import { ReactNode } from "react";

export default function TransparentButton({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <button className="text-xl rounded-full p-4 shadow-lg transition-colors duration-300 hover:bg-white/5 active:bg-purple-700/20 hover:text-white/50">
            {children}
        </button>
    );
}
