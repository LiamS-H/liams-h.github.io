import ExternalLink from "@/components/external-link";
import InternalLink from "@/components/internal-link";
import { useRef, type MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";
import Hitbox from "@/components/hitbox";
import Technology from "@/components/technology";
import { GithubIcon, IconButton } from "@/components/icons";

import LandingImg from "@/assets/ShahrazadLandingPage.png";
import GameImg from "@/assets/ShahrazadInGame.png";
import { ExternalLinkIcon } from "lucide-react";

export function ShahrazadCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="Shahrazad" colorNum={4} parent={scrollable_ref}>
            <h1 className="text-4xl pt-2">Shahrazad</h1>
            <p>Public realtime multiplayer table top game simulator.</p>
            <i>Rich drag and drop features.</i>
            <div className="flex align-middle justify-center flex-row space-x-4">
                <ExternalLink href="https://shahrazad.vercel.app">
                    Vist Site
                </ExternalLink>
                <InternalLink to="/projects/shahrazad">Explore</InternalLink>
            </div>
        </ProjectCard>
    );
}

export default function Shahrazad() {
    const scrollable_ref = useRef<HTMLDivElement | null>(null);
    useFluidColorRegister(4);
    const technologies = [
        "Rust",
        "Wasm",
        "Axum",
        "Next",
        "Vercel",
        "Docker",
        "Dnd-Kit",
    ];
    return (
        <div
            ref={scrollable_ref}
            className="h-[90%] text-white px-14 sm:p-10  space-y-12 overflow-y-auto"
            style={{
                maskImage:
                    "linear-gradient(to top, transparent, black 10%, black 80%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(to top, transparent, black 8%, black 92%, transparent)",
            }}
        >
            <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Hitbox
                        id={"shahrazad-title"}
                        className="p-4 w-fit"
                        parent={scrollable_ref}
                    >
                        <h1 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 animate-gradient-swirl">
                            Shahrazad
                        </h1>
                    </Hitbox>
                    <IconButton to="https://github.com/LiamS-H/shahrazad-app">
                        <GithubIcon />
                    </IconButton>

                    <IconButton to="https://shahrazad.vercel.app">
                        <ExternalLinkIcon className="w-[36px] h-[36px]" />
                    </IconButton>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {technologies.map((n) => (
                        <Technology name={n} scrollable_ref={scrollable_ref} />
                    ))}
                </div>
                <Hitbox
                    id={"shahrazad-desc-0"}
                    className="p-4 w-fit bg-black"
                    parent={scrollable_ref}
                >
                    A table top simulator named after the MTG card and character{" "}
                    <ExternalLink href="https://en.wikipedia.org/wiki/Scheherazade">
                        Shahrazad
                    </ExternalLink>
                    , from <i>"One Thousand and One Nights."</i>
                </Hitbox>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-4">
                        <Hitbox
                            id={"shahrazad-desc-1"}
                            className="p-4 w-fit bg-black"
                            parent={scrollable_ref}
                        >
                            My goal was to replace the laggy generic table-top
                            simulator my friends and I were using with a fast
                            app specialized to play Magic The Gathering. No
                            sign-up required, I made it as easy and fast as
                            possible to create and join games. Upon joining all
                            features to play a game of are available. Players
                            can import their decks, draw their starting hands,
                            and start playing cards by dragging them into play.
                            Everything updates in real time and feels far more
                            responsive than alternatives.
                        </Hitbox>
                        <Hitbox
                            id={"shahrazad-desc-2"}
                            className="p-4 w-fit bg-black"
                            parent={scrollable_ref}
                        >
                            The state machine to handle the game logic is
                            written in a shared rust lib. It is compiled
                            natively on the server and runs as a wasm pkg on
                            client. In this way server updates and optimistic
                            client updates are running the same code.
                        </Hitbox>
                        <Hitbox
                            id={"shahrazad-desc-3"}
                            className="p-4 w-fit bg-black"
                            parent={scrollable_ref}
                        >
                            State transformations are sent using websockets. For
                            non-colliding moves, the server only sends the
                            action over the socket not the full game state. This
                            keeps socket packets small, though a global state is
                            always managed on the server and is retrieved when
                            reconnecting or resolving race conditions.
                        </Hitbox>
                    </div>
                    <div className="flex flex-grow flex-col gap-4">
                        <Hitbox
                            id={"shahrazad-img-1"}
                            className="w-fit"
                            parent={scrollable_ref}
                        >
                            <img src={LandingImg}></img>
                        </Hitbox>
                        <Hitbox
                            id={"shahrazad-img-2"}
                            className="w-fit"
                            parent={scrollable_ref}
                        >
                            <img src={GameImg}></img>
                        </Hitbox>
                    </div>
                </div>
            </div>
        </div>
    );
}
