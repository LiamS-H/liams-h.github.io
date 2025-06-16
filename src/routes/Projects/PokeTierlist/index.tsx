import ExternalLink from "@/components/external-link";
import type { MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";

export function PokeTierlistCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="PokeTierlist" colorNum={6} parent={scrollable_ref}>
            <h1 className="text-4xl">PokeTierlist</h1>
            <p>Using Graphql + Relay with SSR / SSG in Next.</p>
            <i>With a prisma-powered graphql backend.</i>
            <div className="flex justify-center flex-row space-x-4">
                {/* <ExternalLink href="https://pokemon-tierlist-graphql.vercel.app/">
                    Vist Site
                </ExternalLink> */}
                <ExternalLink href="https://github.com/LiamS-H/pokemon-tierlist-graphql">
                    Github
                </ExternalLink>
            </div>
        </ProjectCard>
    );
}
export default function Scrycards() {
    useFluidColorRegister(1);
    return <>PokeTierlist</>;
}
