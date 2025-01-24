import type { HTMLProps, MutableRefObject } from "react";
import Hitbox from "../../components/hitbox";
import { useFluidContext } from "../../contexts/fluid";
export function ProjectCard(
    props: HTMLProps<HTMLDivElement> & {
        id: string;
        colorNum: number;
        parent: MutableRefObject<HTMLDivElement | null>;
    }
) {
    const { id, colorNum, parent, ...divProps } = props;
    const { changeColor } = useFluidContext();
    let textColor: string;
    switch (props.colorNum) {
        case 1:
            textColor =
                // "hover:text-gradient-to-r hover:from-pink-500 hover:to-orange-500";
                "hover:text-orange-300";
            break;
        case 2:
            textColor = "hover:text-green-400";
            break;
        case 3:
            textColor = "hover:text-cyan-300";
            break;
        case 4:
            textColor = "hover:text-red-600";
            break;
        default:
            textColor = "text-white";
    }

    return (
        <Hitbox
            className={`h-60 min-h-60 w-60 min-w-60 mx-4 p-4 flex-col flex justify-between transition-all ${textColor}`}
            // className={`w-1/12 aspect-square min-w-[320px] rounded p-8 m-4 flex-col flex justify-between hover:text-cyan-400 `}
            id={id}
            onMouseEnter={() => changeColor(colorNum)}
            onMouseLeave={() => changeColor(0)}
            onClick={(e) =>
                e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                })
            }
            parent={parent}
            {...divProps}
        >
            {props.children}
        </Hitbox>
    );
}
