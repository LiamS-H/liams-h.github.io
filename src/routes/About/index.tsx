import { Code, Terminal } from "lucide-react";
import Hitbox from "../../components/hitbox";
import { useFluidContext } from "../../contexts/fluid";
import { MutableRefObject, useRef } from "react";

interface Technology {
    name: string;
    type: ("CICD" | "Framework" | "Library" | "Database")[];
}

function Language({
    name,
    years,
    colorNum,
    scrollable_ref,
}: {
    name: string;
    years: string;
    colorNum: number;
    scrollable_ref: MutableRefObject<HTMLDivElement | null>;
}) {
    const { changeColor } = useFluidContext();
    const colorMap: { [key: number]: { bg: string; hover: string } } = {
        2: { bg: "bg-emerald-500", hover: "hover:text-emerald-500" },
        3: { bg: "bg-sky-500", hover: "hover:text-sky-500" },
        1: { bg: "bg-amber-500", hover: "hover:text-amber-500" },
        4: { bg: "bg-rose-500", hover: "hover:text-rose-500" },
        5: { bg: "bg-pink-500", hover: "hover:text-pink-500" },
        6: { bg: "bg-indigo-500", hover: "hover:text-indigo-500" },
    };

    const { bg, hover } = colorMap[colorNum] || colorMap[1];

    return (
        <div
            className={`flex items-center group transition-all duration-300 ${hover}`}
            onMouseEnter={() => changeColor(colorNum)}
            onMouseLeave={() => changeColor(0)}
        >
            <Hitbox id={name} innerBounds={true} parent={scrollable_ref}>
                <div className={`w-3 h-3 mr-3 ${bg}`}></div>
            </Hitbox>
            <span className="font-medium">{name}</span>
            <span className="ml-auto text-gray-300 text-sm">{years} years</span>
        </div>
    );
}

export default function About() {
    const languages = [
        { name: "Python", years: "5+", colorNum: 2 },
        { name: "TypeScript", years: "3+", colorNum: 3 },
        { name: "JavaScript", years: "3+", colorNum: 1 },
        { name: "Rust", years: "2+", colorNum: 4 },
        { name: "C/C++", years: "2+", colorNum: 5 },
        { name: "Java", years: "1+", colorNum: 6 },
    ];

    const technologies: Technology[] = [
        { name: "React", type: ["Framework"] },
        { name: "Next", type: ["Framework"] },
        { name: "Git/Github", type: ["CICD"] },
        { name: "AWS", type: ["CICD", "Database"] },
        { name: "Vercel", type: ["CICD"] },
        { name: "Firebase", type: ["CICD"] },
        { name: "Firestore", type: ["Database"] },
        { name: "Cloudflare", type: ["CICD"] },
        { name: "Docker", type: ["CICD"] },
        { name: "GCloud", type: ["CICD"] },
    ];

    const scrollable_ref = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={scrollable_ref}
            className="h-[90%] text-white p-10 space-y-12 overflow-y-auto"
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
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
                                Getting Things Done
                            </span> */}
                            I have a{" "}
                            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent font-bold">
                                Software Engineering Degree
                            </span>{" "}
                            and all the tools you need so I can hit the ground
                            running.
                        </p>
                    </Hitbox>
                </div>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-12">
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

                <div className="">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Terminal className="mr-2 text-sky-500" /> Technologies
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {technologies.map((tech) => (
                            <Hitbox
                                id={tech.name}
                                key={tech.name}
                                parent={scrollable_ref}
                            >
                                <span
                                    className="px-3 py-1 text-sm 
                  bg-gradient-to-r from-white to-purple-500 
                  bg-[length:200%_100%] bg-left hover:bg-right 
                  transition-all duration-300 text-transparent bg-clip-text"
                                >
                                    {tech.name}
                                </span>
                            </Hitbox>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
