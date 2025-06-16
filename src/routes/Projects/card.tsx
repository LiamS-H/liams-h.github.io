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
            textColor = "from-pink-500 via-orange-500 to-pink-500";
            break;
        case 2:
            textColor = "from-emerald-600 via-lime-300 to-emerald-600";
            break;
        case 3:
            textColor = "from-cyan-400 via-blue-500 to-cyan-400";
            break;
        case 4:
            textColor = "from-pink-400 via-rose-800 to-pink-400";
            break;
        case 6:
            textColor = "from-purple-600 via-blue-800 to-purple-600";
            break;
        default:
            textColor = "";
    }

    return (
        <Hitbox
            className={`w-60 min-w-60 h-60 min-h-60 mx-4 p-4 bg-black`}
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
            <div
                className={`h-full flex flex-col justify-between transition-all bg-clip-text hover:text-transparent animate-gradient-swirl bg-gradient-to-r ${textColor}`}
            >
                {props.children}
            </div>
        </Hitbox>
    );
}
