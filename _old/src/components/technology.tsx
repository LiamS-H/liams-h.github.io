import Hitbox from "@/components/hitbox";
import { MutableRefObject } from "react";

export type TechType = "CICD" | "Framework" | "Library" | "Database";

export interface ITechnology {
    name: string;
    type: TechType[];
}

export default function Technology({
    name,
    scrollable_ref,
}: {
    name: string;
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <Hitbox id={name} key={name} parent={scrollable_ref}>
            <span
                className="px-3 py-1 text-sm 
                  bg-gradient-to-r from-white to-purple-500 
                  bg-[length:300%_150%] bg-left hover:bg-right 
                  transition-all duration-300 text-transparent bg-clip-text"
            >
                {name}
            </span>
        </Hitbox>
    );
}
