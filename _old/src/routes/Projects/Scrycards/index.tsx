import ExternalLink from "@/components/external-link";
import type { MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";

export function ScrycardsCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="Scrycards" colorNum={1} parent={scrollable_ref}>
            <h1 className="text-5xl">Scrycards</h1>
            <p>
                A react component library that wraps a{" "}
                <ExternalLink href="https://scryfall.com/docs/api">
                    Public API
                </ExternalLink>{" "}
                and provides a lightweight cache + components.
            </p>
            <div className="flex justify-center flex-row space-x-4">
                <ExternalLink href="https://github.com/LiamS-H/react-scrycards">
                    Github
                </ExternalLink>
            </div>
        </ProjectCard>
    );
}
export default function Scrycards() {
    useFluidColorRegister(1);
    return <>Scrycards</>;
}
