import { HTMLProps } from "react";
import Hitbox from "../../components/hitbox";
import ExternalLink from "../../components/external-link";
import { useFluidContext } from "../../contexts/fluid";

function Card(
    props: HTMLProps<HTMLDivElement> & { id: string; colorNum: number }
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
            {...props}
            className={`w-1/12 aspect-square min-w-[320px] rounded p-8 m-4 flex-col flex justify-between transition-all ${textColor}`}
            // className={`w-1/12 aspect-square min-w-[320px] rounded p-8 m-4 flex-col flex justify-between hover:text-cyan-400 `}
            id={props.id}
            onMouseEnter={() => changeColor(props.colorNum)}
            onMouseLeave={() => changeColor(0)}
        >
            {props.children}
        </Hitbox>
    );
}

export default function Projects() {
    return (
        <div className="h-full flex flex-col align-middle justify-center">
            <div className="h-fit flex flex-col lg:flex-row justify-around items-center overflow-auto">
                <Card id="Scrycards" colorNum={1}>
                    <h1 className="pb-1">Scrycards</h1>
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
                </Card>
                <Card id="FOOOD" colorNum={2}>
                    <h1>Food ML</h1>
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
                </Card>
                <Card id="Confluence" colorNum={3}>
                    <h1>Confluence</h1>
                    <p>
                        Public website with visual tools and syntax for advanced
                        Scryfall database queries.
                    </p>
                    <div className="flex align-middle justify-center flex-row space-x-4">
                        <ExternalLink href="https://card-confluence.web.app/about">
                            Vist Site
                        </ExternalLink>
                    </div>
                </Card>
            </div>
        </div>
    );
}
