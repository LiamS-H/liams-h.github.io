import ExternalLink from "@/components/external-link";
import InternalLink from "@/components/internal-link";
import { type MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";

import LandingImg from "@/assets/ShahrazadLandingPage.png";
import GameImg from "@/assets/ShahrazadInGame.png";
import { ProjectPage } from "@/components/project-page";

export function ShahrazadCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="Shahrazad" colorNum={4} parent={scrollable_ref}>
            <h1 className="text-4xl pt-2">Shahrazad</h1>
            <p>Public realtime multiplayer table top game simulator.</p>
            <i>Custom WASM Sync Engine, Rich drag and drop.</i>
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
    useFluidColorRegister(4);
    return (
        <ProjectPage
            colorNum={4}
            images={[
                {
                    src: LandingImg,
                    alt: "Landing Page",
                },
                { src: GameImg, alt: "In Game" },
            ]}
            paragraphs={[
                `My goal was to replace the laggy generic table-top
                simulator my friends and I were using with a fast
                app specialized to play Magic The Gathering. No
                sign-up required, I made it as quick and easy as
                possible to create and join games.`,
                `Upon joining, all
                features to play a game of Magic are available.
                Players can import their decks, draw their starting
                hands, and start playing cards by dragging them into
                play. Everything updates in real time and feels far
                more responsive than alternatives.`,
                `The state machine to handle the game logic is
                written in a shared rust lib. It is compiled
                natively on the server and runs as a wasm pkg on
                client. In this way server updates and optimistic
                client updates are running the same code.`,
                `State transformations are sent using websockets. For
                non-colliding moves, the server only sends the
                action over the socket not the full game state. This
                keeps socket packets small, until a desync occur
                with coliding moves and server sends a full state.`,
            ]}
            githubLink="https://github.com/LiamS-H/shahrazad-app"
            liveLink="https://shahrazad.vercel.app"
            technologies={[
                "Rust",
                "Wasm",
                "Axum",
                "Next",
                "Vercel",
                "Docker",
                "Dnd-Kit",
            ]}
            title="Shahrazad"
            intro={
                <>
                    A table top simulator named after the MTG card and character{" "}
                    <ExternalLink href="https://en.wikipedia.org/wiki/Scheherazade">
                        Shahrazad
                    </ExternalLink>
                    , from <i>"One Thousand and One Nights."</i>
                </>
            }
        />
    );
}
