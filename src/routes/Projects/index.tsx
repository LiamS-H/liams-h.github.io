import {
    HTMLProps,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from "react";
import Hitbox from "../../components/hitbox";
import ExternalLink from "../../components/external-link";
import { useFluidContext } from "../../contexts/fluid";
import { ArrowLeft, ArrowRight } from "lucide-react";

function debounce<F extends (...args: any[]) => any>(func: F, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: Parameters<F>) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function ProjectCard(
    props: HTMLProps<HTMLDivElement> & {
        id: string;
        colorNum: number;
        parent: MutableRefObject<HTMLDivElement | null>;
    }
) {
    const { changeColor } = useFluidContext();
    let textColor: string;
    switch (props.colorNum) {
        case 1:
            textColor =
                // "hover:text-gradient-to-r hover:from-pink-500 hover:to-orange-500";
                "hover:text-orange-300";
            break;
        case 2:
            textColor = "hover:text-green-400";
            break;
        case 3:
            textColor = "hover:text-cyan-300";
            break;
        default:
            textColor = "text-white";
    }

    return (
        <Hitbox
            className={`h-60 w-60 mx-4 p-4 flex-col flex justify-between transition-all ${textColor}`}
            // className={`w-1/12 aspect-square min-w-[320px] rounded p-8 m-4 flex-col flex justify-between hover:text-cyan-400 `}
            id={props.id}
            onMouseEnter={() => changeColor(props.colorNum)}
            onMouseLeave={() => changeColor(0)}
            parent={props.parent}
        >
            {props.children}
        </Hitbox>
    );
}

export default function Projects() {
    const scrollable_ref = useRef<HTMLDivElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalChildren, setTotalChildren] = useState(0);

    useEffect(() => {
        const container = scrollable_ref.current;
        if (!container) return;

        const children = Array.from(container.children);
        setTotalChildren(children.length);

        const handleScroll = () => {
            const children = Array.from(container.children);
            let closestChild: Element | null = null;
            let minDistance = Infinity;
            let closestIndex = 0;
            const parentRect = container.getBoundingClientRect();

            for (let i = 1; i < children.length - 1; i++) {
                const child = children[i];
                const rect = child.getBoundingClientRect();
                const distance = Math.abs(
                    rect.left +
                        rect.width / 2 -
                        (parentRect.left + parentRect.width / 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestChild = child;
                    closestIndex = i;
                }
            }

            setCurrentIndex(closestIndex);

            if (closestChild) {
                closestChild.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center",
                });
            }
        };
        handleScroll();

        const debouncedHandleScroll = debounce(handleScroll, 100);

        container.addEventListener("scroll", debouncedHandleScroll);

        return () => {
            container.removeEventListener("scroll", debouncedHandleScroll);
        };
    }, []);

    const navigateProject = (direction: "left" | "right") => {
        const container = scrollable_ref.current;
        if (!container) return;

        const children = Array.from(container.children);
        const newIndex =
            direction === "left"
                ? Math.max(0, currentIndex - 1)
                : Math.min(totalChildren - 1, currentIndex + 1);

        setCurrentIndex(newIndex);

        children[newIndex].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    };
    return (
        <div className="h-full px-16 md:px-32 flex flex-col justify-center">
            <div className="flex flex-col-reverse justify-center">
                <div className="flex w-full justify-center">
                    <div className="absolute left-4 top-1/2 transform md:static md:left-auto md:top-auto z-10">
                        <button
                            onClick={() => navigateProject("left")}
                            disabled={currentIndex === 1}
                            className=" p-2 rounded-full disabled:opacity-50"
                        >
                            <ArrowLeft />
                        </button>
                    </div>
                    <div className="absolute right-4 top-1/2 transform md:static md:left-auto md:top-auto z-10">
                        <button
                            onClick={() => navigateProject("right")}
                            disabled={currentIndex === totalChildren - 2}
                            className="p-2 rounded-full disabled:opacity-50"
                        >
                            <ArrowRight />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollable_ref}
                    className="h-fit gap-8 flex flex-row justify-around items-center overflow-auto"
                    style={{
                        maskImage:
                            "linear-gradient(to right, transparent, black 20%, black 60%, transparent)",
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, black 20%, black 60%, transparent)",
                        scrollbarWidth: "none",
                    }}
                >
                    <div className="min-w-[45%]" />
                    <ProjectCard
                        id="Scrycards"
                        colorNum={1}
                        parent={scrollable_ref}
                    >
                        <h1 className="text-5xl">Scrycards</h1>
                        <p>
                            A react component library that wraps{" "}
                            <ExternalLink href="https://scryfall.com/docs/api">
                                Scryfall API
                            </ExternalLink>{" "}
                            and provides a lightweight cache.
                        </p>
                        <div className="flex justify-center flex-row space-x-4">
                            <ExternalLink href="https://github.com/LiamS-H/react-scrycards">
                                Github
                            </ExternalLink>
                        </div>
                    </ProjectCard>
                    <ProjectCard
                        id="FOOOD"
                        colorNum={2}
                        parent={scrollable_ref}
                    >
                        <h1 className="text-5xl">FoodML</h1>
                        <p>
                            A machine learning full stack project for estimating
                            caloric data from images.
                            <br />
                            <i>1st place HackMecedIX.</i>
                        </p>
                        <div className="flex align-middle justify-center flex-row space-x-4">
                            <ExternalLink href="https://devpost.com/software/foooood">
                                Devpost
                            </ExternalLink>
                        </div>
                    </ProjectCard>
                    <ProjectCard
                        id="Confluence"
                        colorNum={3}
                        parent={scrollable_ref}
                    >
                        <h1 className="text-4xl">Confluence</h1>
                        <p>
                            Public website with visual tools and syntax for
                            advanced Scryfall database queries.
                        </p>
                        <div className="flex align-middle justify-center flex-row space-x-4">
                            <ExternalLink href="https://card-confluence.web.app/about">
                                Vist Site
                            </ExternalLink>
                        </div>
                    </ProjectCard>
                    <div className="min-w-[500px]" />
                </div>
            </div>
        </div>
    );
}
