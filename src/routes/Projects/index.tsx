import { HTMLProps, MutableRefObject, useRef } from "react";
import Hitbox from "../../components/hitbox";
import ExternalLink from "../../components/external-link";
import { useFluidContext } from "../../contexts/fluid";

function ProjectCard(
    props: HTMLProps<HTMLDivElement> & {
        id: string;
        colorNum: number;
        parent: MutableRefObject<HTMLDivElement | null>;
    }
) {
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
        default:
            textColor = "text-white";
    }

    return (
        <Hitbox
            className={`h-60 w-60 mx-4 p-4 flex-col flex justify-between transition-all ${textColor}`}
            // className={`w-1/12 aspect-square min-w-[320px] rounded p-8 m-4 flex-col flex justify-between hover:text-cyan-400 `}
            id={props.id}
            onMouseEnter={() => changeColor(props.colorNum)}
            onMouseLeave={() => changeColor(0)}
            parent={props.parent}
        >
            {props.children}
        </Hitbox>
    );
}

export default function Projects() {
    const scrollable_ref = useRef<HTMLDivElement | null>(null);
    return (
        <div className="h-full px-16 md:px-32 flex flex-col justify-center">
            <div
                ref={scrollable_ref}
                className="h-fit py-8 gap-8 flex flex-row justify-around items-center overflow-auto"
                style={{
                    maskImage:
                        "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                }}
            >
                <ProjectCard
                    id="Scrycards"
                    colorNum={1}
                    parent={scrollable_ref}
                >
                    <h1 className="text-5xl">Scrycards</h1>
                    <p>
                        A react component library that wraps{" "}
                        <ExternalLink href="https://scryfall.com/docs/api">
                            Scryfall API
                        </ExternalLink>{" "}
                        and provides a lightweight cache.
                    </p>
                    <div className="flex justify-center flex-row space-x-4">
                        <ExternalLink href="https://github.com/LiamS-H/react-scrycards">
                            Github
                        </ExternalLink>
                    </div>
                </ProjectCard>
                <ProjectCard id="FOOOD" colorNum={2} parent={scrollable_ref}>
                    <h1 className="text-5xl">FoodML</h1>
                    <p>
                        A machine learning full stack project for estimating
                        caloric data from images.
                        <br />
                        <i>1st place HackMecedIX.</i>
                    </p>
                    <div className="flex align-middle justify-center flex-row space-x-4">
                        <ExternalLink href="https://devpost.com/software/foooood">
                            Devpost
                        </ExternalLink>
                    </div>
                </ProjectCard>
                <ProjectCard
                    id="Confluence"
                    colorNum={3}
                    parent={scrollable_ref}
                >
                    <h1 className="text-4xl">Confluence</h1>
                    <p>
                        Public website with visual tools and syntax for advanced
                        Scryfall database queries.
                    </p>
                    <div className="flex align-middle justify-center flex-row space-x-4">
                        <ExternalLink href="https://card-confluence.web.app/about">
                            Vist Site
                        </ExternalLink>
                    </div>
                </ProjectCard>
            </div>
        </div>
    );
}
