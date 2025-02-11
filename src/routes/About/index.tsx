import { Code, Copy, Terminal } from "lucide-react";
import Hitbox from "../../components/hitbox";
import Technology, { ITechnology, TechType } from "../../components/technology";
import { Language } from "./language";
import { useRef, useState } from "react";
import Dropdown from "@/routes/About/dropdown";
import { LinkedInIcon, GithubIcon, IconButton } from "@/components/icons";
import { useFluidColorRegister, useFluidContext } from "@/contexts/fluid";
import InternalLink from "@/components/internal-link";
import TransparentButton from "@/components/transparent-button";

export default function About() {
    const [bioOpen, setBioOpen] = useState(false);
    const { changeColor } = useFluidContext();
    useFluidColorRegister(0);
    const languages = [
        { name: "Python", years: "5+", colorNum: 2 },
        { name: "TypeScript", years: "3+", colorNum: 3 },
        { name: "JavaScript", years: "3+", colorNum: 1 },
        { name: "Rust", years: "2+", colorNum: 4 },
        { name: "C/C++", years: "2+", colorNum: 5 },
        { name: "Java", years: "1+", colorNum: 6 },
    ];

    const all_technologies: ITechnology[] = [
        { name: "React", type: ["Framework"] },
        { name: "Next", type: ["Framework"] },
        { name: "Expo", type: ["Framework"] },
        { name: "Flask", type: ["Framework"] },
        { name: "Express", type: ["Framework"] },
        { name: "Axum", type: ["Framework"] },
        { name: "Git/Github", type: ["CICD"] },
        { name: "AWS", type: ["CICD"] },
        { name: "Vercel", type: ["CICD"] },
        { name: "Firebase", type: ["CICD"] },
        { name: "Firestore", type: ["Database"] },
        { name: "SQL/SQLite", type: ["Database"] },
        { name: "Redis", type: ["Database"] },
        { name: "MongoDB", type: ["Database"] },
        { name: "Cloudflare", type: ["CICD"] },
        { name: "Docker", type: ["CICD"] },
        { name: "GCloud", type: ["CICD"] },
        { name: "Dnd-Kit", type: ["Library"] },
        { name: "ReactQuery", type: ["Library"] },
        { name: "wasm-pack", type: ["Library"] },
    ];

    const scrollable_ref = useRef<HTMLDivElement | null>(null);
    const [sort, setSort] = useState<TechType | null>(null);

    const technologies =
        sort === null
            ? all_technologies
            : all_technologies.filter((tech) => tech.type.includes(sort));

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
            {/* <div className=""> */}
            <div className="max-w-4xl mx-auto p-4">
                <Hitbox
                    id={"about-desc"}
                    className="flex flex-col p-4 m-1 bg-black"
                    parent={scrollable_ref}
                >
                    <p className="text-lg leading-relaxed">
                        <span className="text-4xl">
                            Hi, I'm{" "}
                            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-bold">
                                Liam Stelly-Hawkes
                            </span>
                            .
                            <br />
                        </span>
                        {/* with a knack for{" "}
                         */}
                        I have a{" "}
                        <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent font-bold">
                            Software Engineering Degree
                        </span>{" "}
                        and all the tools you need so I can{" "}
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
                            hit the ground running.
                        </span>
                    </p>
                    <button
                        className="mx-auto mt-2 py-1 px-2 rounded-md shadow-lg  w-fit h-fit transition-all duration-500 shadow-cyan-300 text-cyan-100 hover:text-cyan-400 hover:shadow-cyan-600"
                        onClick={() =>
                            setBioOpen((o) => {
                                if (o) changeColor(0);
                                else changeColor(3);
                                return !o;
                            })
                        }
                    >
                        {bioOpen ? "Read Less" : "Read More"}
                    </button>
                </Hitbox>
                <div className="flex gap-3">
                    <IconButton to="https://github.com/LiamS-H">
                        <GithubIcon />
                    </IconButton>
                    <IconButton to="https://www.linkedin.com/in/lstelly-hawkes/">
                        <LinkedInIcon />
                    </IconButton>
                    <TransparentButton
                        onClick={() => {
                            navigator.clipboard.writeText("liamsh@gmail.com");
                        }}
                    >
                        liamsh@gmail.com
                        <Copy />
                    </TransparentButton>
                </div>
                {bioOpen && (
                    <div className="max-w-4xl mx-auto pt-4">
                        <div className="flex flex-col gap-8">
                            <Hitbox
                                className="p-4 ml-auto max-w-2xl bg-black"
                                id="bio-1"
                                parent={scrollable_ref}
                            >
                                I specialize in Typescript and React but the
                                last 3 years I've also been chasing my other
                                passion working as a whitewater rafting and
                                outdoor guide. A river is a special place and it
                                brings me great joy to see eddies and vortices
                                wrap around the elements on this page.
                                Hydrodynamics is not usually a concern when
                                working on a site layout, but here we are!
                            </Hitbox>

                            <Hitbox
                                className="p-4 mr-auto max-w-2xl bg-black"
                                id="bio-2"
                                parent={scrollable_ref}
                            >
                                My personal projects over the last few years
                                have all followed a similar suit, being mostly
                                practical and related to things I'm interested
                                in at the time. My recent fixation has been a
                                little ecosystem of projects related to Magic
                                The Gathering; this culminated in a{" "}
                                <InternalLink to="/projects/shahrazad">
                                    table-top simulator
                                </InternalLink>{" "}
                                that I use to play Magic with my friends a few
                                nights a week.
                            </Hitbox>
                            <Hitbox
                                className="p-4 ml-auto max-w-2xl bg-black"
                                id="bio-3"
                                parent={scrollable_ref}
                            >
                                While I currently live near Sacramento, CA, I'm
                                happy to relocate.
                            </Hitbox>

                            {/* <Hitbox
                                className="p-4 mr-auto max-w-2xl"
                                id="bio-3"
                                parent={scrollable_ref}
                            >
                                I fell in love with programming in the sixth
                                grade starting with visual languages like
                                Scratch and EV3-G (a lego coding language),
                                before a friend showed me python in middle
                                school. Throughout middle and highschool I
                                created dozens of small video game projects.
                                While it's mostly inapplicable to anything I do
                                now, they got me thinking algorithmically. When
                                I retire I want to teach and giver others that
                                same experience and wonder I'm so grateful for.
                            </Hitbox> */}
                        </div>
                    </div>
                )}
            </div>
            {/* </div> */}

            {!bioOpen && (
                <>
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                        <div className="min-w-56">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <Code className="mr-2 text-emerald-500" />
                                Languages
                            </h2>
                            <div>
                                {languages.map((lang) => (
                                    <Language
                                        key={lang.name}
                                        name={lang.name}
                                        years={lang.years}
                                        colorNum={lang.colorNum}
                                        scrollable_ref={scrollable_ref}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="w-full min-h-[400px]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <Terminal className="mr-2 text-sky-500" />{" "}
                                    Technologies
                                </h2>
                                <Dropdown
                                    options={[
                                        "CICD",
                                        "Database",
                                        "Framework",
                                        "Library",
                                    ]}
                                    onSelect={(s) => setSort(s)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {technologies.map((tech) => (
                                    <Technology
                                        key={sort + tech.name}
                                        name={tech.name}
                                        scrollable_ref={scrollable_ref}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="min-h-[20%] md:absolute" />
        </div>
    );
}
