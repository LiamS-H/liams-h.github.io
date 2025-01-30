import ExternalLink from "@/components/external-link";
import type { MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";

export function FOOODCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="FOOOD" colorNum={2} parent={scrollable_ref}>
            <h1 className="text-5xl">FoodML</h1>
            <p>
                A machine learning full stack project for estimating caloric
                data from images.
                <br />
                <i>1st place HackMecedIX.</i>
            </p>
            <div className="flex align-middle justify-center flex-row space-x-4">
                <ExternalLink href="https://devpost.com/software/foooood">
                    Devpost
                </ExternalLink>
            </div>
        </ProjectCard>
    );
}

export default function FOOD() {
    useFluidColorRegister(2);
    return <>Shahrazad</>;
}
