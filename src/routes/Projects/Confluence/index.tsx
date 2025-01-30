import ExternalLink from "@/components/external-link";
import { type MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";

export function ConfluenceCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="Confluence" colorNum={3} parent={scrollable_ref}>
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
    );
}

export default function Confluence() {
    useFluidColorRegister(3);
    return <>Shahrazad</>;
}
