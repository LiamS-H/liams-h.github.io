// import ExternalLink from "@/components/external-link";
import InternalLink from "@/components/internal-link";
import { type MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";

import { ProjectPage } from "@/components/project-page";
import Upload from "@/assets/RibbonUpload.png";
import Diagram from "@/assets/RibbonDiagram.png";

export function RibbonCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="RibbonDiagram" colorNum={6} parent={scrollable_ref}>
            <h1 className="text-4xl text-[2.15rem] pt-2">DNA Ribbons</h1>
            <p>An internal tool for creating genomic ribbon diagrams.</p>
            <i>Web Workers, Canvas, and a Custom graph solver.</i>
            <div className="flex align-middle justify-center flex-row space-x-4">
                <InternalLink to="/projects/ribbons">Explore</InternalLink>
            </div>
        </ProjectCard>
    );
}

export default function RibbonDiagram() {
    useFluidColorRegister(6);
    return (
        <ProjectPage
            title="Ribbons"
            technologies={["WebWorkers", "Canvas2D", "Next", "Vercel"]}
            colorNum={6}
            images={[
                {
                    src: Upload,
                    alt: "File Upload",
                },
                { src: Diagram, alt: "Diagram" },
            ]}
            intro={"A ribbon diagram visualization tool."}
            paragraphs={[
                `Made for a biology lab at UC Berkeley, using graph solvers
                to render beautiful traces of the genes that encode for proteins
                with similar functions. Data is collected from HMMs (Hidden Markov Models)
                trained to analyze and isolate genes which encode proteins with similar function.`,
                `A multi-threaded web-application using web workers to parse data and 
                a proprietary graph solver to create beautiful plots. The plots are rendered using
                the OffscreenCanvas API from a worker thread and kept responsive using a shared memory layer
                that can stop expensive tasks mid computation when settings are changed.`,
                `Many settings are available to manipulate the plots and highlighting specific HMM groupings, and a responsive drag-and-drop
                UI allows organisms to be rearranged. Plots can be exported as high quality pngs ready for academic use,
                though this tool sees most of its use as a quick way to validate, and rapidly prototype, on modifications to the HMM.`,
                // `Further collaboration related to public deployments and integration of the HMM within the visualization tool is in the works.`,
            ]}
        />
    );
}
