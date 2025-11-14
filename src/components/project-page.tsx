import { type ReactNode, useRef } from "react";
import Hitbox from "./hitbox";
import { GithubIcon, IconButton } from "./icons";
import { ArrowLeft, ArrowRight, ExternalLinkIcon } from "lucide-react";
import Technology from "./technology";
import { useFluidColorRegister } from "@/contexts/fluid";
import { projectPages } from "@/routes/Projects/project-list";
import { Link } from "react-router-dom";

const colors = [
    "",
    "from-pink-500 via-orange-500 to-pink-500",
    "from-emerald-600 via-lime-300 to-emerald-600",
    "from-cyan-400 via-blue-500 to-cyan-400",
    "from-pink-500 via-rose-500 to-pink-500",
    "",
    "from-purple-600 via-blue-800 to-purple-600",
];

export function ProjectPage({
    title,
    intro,
    githubLink,
    liveLink,
    technologies,
    paragraphs,
    images,
    colorNum,
}: {
    title: string;
    intro: ReactNode;
    githubLink?: string;
    liveLink?: string;
    technologies: string[];
    paragraphs: string[];
    images: { src: string; alt: string }[];
    colorNum: number;
}) {
    const scrollable_ref = useRef<HTMLDivElement | null>(null);
    useFluidColorRegister(colorNum);

    const currentIndex = projectPages.findIndex((p) => p.name === title);
    const prevProject =
        currentIndex > 0 ? projectPages[currentIndex - 1] : null;
    const nextProject =
        currentIndex !== -1 &&
        projectPages[(currentIndex + 1) % projectPages.length];

    return (
        <div
            ref={scrollable_ref}
            className="h-[90%] text-white pt-10 px-14 overflow-y-auto relative"
            style={{
                maskImage:
                    "linear-gradient(to top, transparent, black 10%, black 80%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(to top, transparent, black 8%, black 92%, transparent)",
            }}
        >
            <div className="max-w-4xl mx-auto px-4 flex flex-col gap-4">
                <div className="flex flex-col gap-4 md:flex-row-reverse justify-between">
                    {/* Navigation */}
                    <div className="flex gap-4 justify-around md:justify-start">
                        {prevProject ? (
                            <Link
                                to={prevProject.path}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft />
                                <div className="text-left">
                                    <div className="text-sm text-gray-400">
                                        Previous
                                    </div>
                                    <div className="font-semibold">
                                        {prevProject.name}
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div />
                        )}
                        {nextProject ? (
                            <Link
                                to={nextProject.path}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">
                                        Next
                                    </div>
                                    <div className="font-semibold">
                                        {nextProject.name}
                                    </div>
                                </div>
                                <ArrowRight />
                            </Link>
                        ) : (
                            <div />
                        )}
                    </div>
                    {/* Title and Icons */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Hitbox
                            id={`${title
                                .toLowerCase()
                                .replace(/\s/g, "-")}-title`}
                            className="p-4 w-fit"
                            parent={scrollable_ref}
                        >
                            <h1
                                className={`font-bold bg-clip-text text-transparent bg-gradient-to-r ${
                                    colors[colorNum] ?? ""
                                } animate-gradient-swirl text-4xl`}
                            >
                                {title}
                            </h1>
                        </Hitbox>
                        {githubLink && (
                            <IconButton to={githubLink}>
                                <GithubIcon />
                            </IconButton>
                        )}
                        {liveLink && (
                            <IconButton to={liveLink}>
                                <ExternalLinkIcon className="w-[36px] h-[36px]" />
                            </IconButton>
                        )}
                    </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {technologies.map((name, index) => (
                        <Technology
                            key={index}
                            name={name}
                            scrollable_ref={scrollable_ref}
                        />
                    ))}
                </div>

                <Hitbox
                    parent={scrollable_ref}
                    className="p-4 w-fit"
                    id={`${title}-intro`}
                >
                    {intro}
                </Hitbox>

                {/* Paragraphs and Images */}
                <div className="flex flex-col md:flex-row gap-10 sm:gap-4">
                    <div className="flex flex-col gap-10 sm:gap-4">
                        {paragraphs.map((paragraph, index) => (
                            <Hitbox
                                key={index}
                                id={`${title}-desc-${index}`}
                                className="p-4 w-fit bg-black"
                                parent={scrollable_ref}
                            >
                                {paragraph}
                            </Hitbox>
                        ))}
                    </div>
                    <div className="flex flex-grow flex-col gap-10 sm:gap-4 w-full md:max-w-[280px]">
                        {images.map((image, index) => (
                            <Hitbox
                                key={index}
                                id={`${title
                                    .toLowerCase()
                                    .replace(/\s/g, "-")}-img-${index}`}
                                className="w-full"
                                parent={scrollable_ref}
                            >
                                <img src={image.src} alt={image.alt} />
                            </Hitbox>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
