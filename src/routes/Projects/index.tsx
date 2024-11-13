import { HTMLProps } from "react";
import Hitbox from "../../components/hitbox";
import ExternalLink from "../../components/external-link";

function Card(props: HTMLProps<HTMLDivElement> & { id: string }) {
    return (
        <Hitbox
            {...props}
            className={
                "w-1/12 aspect-square min-w-[300px] h-fit bg-black rounded p-4 m-4 flex-col flex"
            }
            id={props.id}
        >
            {props.children}
        </Hitbox>
    );
}

export default function Projects() {
    return (
        <div className="h-full flex flex-col align-middle justify-center">
            <div className="h-fit flex flex-row justify-around align-middle flex-wrap">
                <Card id="Scrycards">
                    <h1 className="pb-1">Scrycards</h1>
                    <p>
                        Wraps{" "}
                        <ExternalLink href="https://scryfall.com/docs/api">
                            Scryfall API
                        </ExternalLink>{" "}
                        in a lightweight cache and provides react components for
                        rendering the returned data. Dependency injection allows
                        for using custom caches, or API wrappers / endpoints.
                    </p>
                    <div className="flex justify-center flex-row space-x-4">
                        <ExternalLink href="https://github.com/LiamS-H/react-scrycards">
                            Github
                        </ExternalLink>
                        <ExternalLink href="https://card-confluence.web.app/about">
                            Example site
                        </ExternalLink>
                    </div>
                </Card>
                <Card id="FOOOD">
                    <h1>Food ML</h1>
                    <p>
                        A machine learning full stack project for estimating
                        caloric data from images. This project was a 1st place
                        winner at HackMecedIX.
                    </p>
                    <div className="flex justify-center flex-row space-x-4">
                        <ExternalLink href="https://devpost.com/software/foooood">
                            Devpost
                        </ExternalLink>
                    </div>
                </Card>
            </div>
        </div>
    );
}
