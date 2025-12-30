import ExternalLink from "@/components/external-link";
import { type MutableRefObject } from "react";
import { ProjectCard } from "../card";
import { useFluidColorRegister } from "@/contexts/fluid";
import { ProjectPage } from "@/components/project-page";
import InternalLink from "@/components/internal-link";

export function ConfluenceCard({
    scrollable_ref,
}: {
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    return (
        <ProjectCard id="Confluence" colorNum={3} parent={scrollable_ref}>
            <h1 className="text-4xl pt-2">Confluence</h1>
            <p>In browser text editor for writing database queries.</p>
            <i>With custom MCP and tuned LLM for generation.</i>
            <div className="flex align-middle justify-center flex-row space-x-4">
                <ExternalLink href="https://cconfluence.vercel.app">
                    Vist Site
                </ExternalLink>
                <InternalLink to="/projects/confluence">Explore</InternalLink>
            </div>
        </ProjectCard>
    );
}

export default function Confluence() {
    useFluidColorRegister(3);
    return (
        <ProjectPage
            title="Card Confluence"
            technologies={[
                "CodeMirror",
                "GeminiAPI (Agents)",
                "Next",
                "Vercel",
            ]}
            colorNum={3}
            images={[]}
            intro={
                <>
                    An in-browser text editor with syntax highlighting and
                    autocompletion for the{" "}
                    <ExternalLink href="https://scryfall.com/docs/syntax">
                        Scryfall
                    </ExternalLink>{" "}
                    query language.
                </>
            }
            paragraphs={[
                `Utilize a custom agent with functions to interface with the document,
                look up query syntax in the autocomplete lib, and access data from the database directly.
                This empowers the agent to perform complex natural language queries like, "show me items like this item", or "improve
                my query by omitting items like this that don't belong."`,
            ]}
        />
    );
}
