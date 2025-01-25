import { Code, Terminal } from "lucide-react";
import Hitbox from "../../components/hitbox";
import Technology, { ITechnology, TechType } from "./technology";
import { Language } from "./language";
import { useRef, useState } from "react";
import Dropdown from "@/routes/About/dropdown";

export default function About() {
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
        { name: "AWS Hosting", type: ["CICD", "Database"] },
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
            className="h-[90%] text-white p-10 space-y-12 overflow-y-auto"
            style={{
                maskImage:
                    "linear-gradient(to top, transparent, black 10%, black 80%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(to top, transparent, black 8%, black 92%, transparent)",
            }}
        >
            <div className="max-w-4xl mx-auto">
                <div className="p-1 m-4 rounded-lg bg-black transition-all duration-300">
                    <Hitbox
                        id={"about-desc"}
                        className="flex"
                        parent={scrollable_ref}
                    >
                        <p className="text-lg leading-relaxed p-4">
                            <span className="text-4xl">
                                Hi, I'm{" "}
                                <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-bold">
                                    Liam
                                </span>
                                .<br />
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
                    </Hitbox>
                </div>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                <div className="min-w-56">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Code className="mr-2 text-emerald-500" />
                        Languages
                    </h2>
                    <div className="space-y-4">
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

                <div className="w-full">
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
                                key={tech.name}
                                tech={tech}
                                scrollable_ref={scrollable_ref}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="min-h-[45%] md:min-h-0" />
        </div>
    );
}
