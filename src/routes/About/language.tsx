import Hitbox from "@/components/hitbox";
import { useFluidContext } from "@/contexts/fluid";
import { type MutableRefObject } from "react";

export function Language({
    name,
    years,
    colorNum,
    scrollable_ref,
}: {
    name: string;
    years: string;
    colorNum: number;
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    const { changeColor } = useFluidContext();
    const colorMap: { [key: number]: { bg: string; hover: string } } = {
        2: { bg: "bg-emerald-500", hover: "hover:text-emerald-500" },
        3: { bg: "bg-sky-500", hover: "hover:text-sky-500" },
        1: { bg: "bg-amber-500", hover: "hover:text-amber-500" },
        4: { bg: "bg-rose-700", hover: "hover:text-rose-700" },
        5: { bg: "bg-pink-600", hover: "hover:text-pink-600" },
        6: { bg: "bg-indigo-500", hover: "hover:text-indigo-500" },
    };

    const { bg, hover } = colorMap[colorNum] || colorMap[1];

    return (
        <div
            className={`p-2 flex items-center max-w-md group transition-all duration-300 ${hover}`}
            onMouseEnter={() => changeColor(colorNum)}
            onMouseLeave={() => changeColor(0)}
        >
            <Hitbox id={name} innerBounds={true} parent={scrollable_ref}>
                <div className={`w-3 h-3 mr-3 ${bg}`}></div>
            </Hitbox>
            <span className="font-medium">{name}</span>
            <span className="ml-auto text-gray-300 text-sm">{years} years</span>
        </div>
    );
}
