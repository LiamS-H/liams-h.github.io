import ExternalLink from "@/components/external-link";
import InternalLink from "@/components/internal-link";
import { type MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";

export function ShahrazadCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="Shahrazad" colorNum={4} parent={scrollable_ref}>
            <h1 className="text-4xl">Shahrazad</h1>
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
    useFluidColorRegister(4);
    return <>Shahrazad</>;
}
