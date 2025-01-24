import { useEffect, useRef, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectCard } from "./card";
import { ScrycardsCard } from "./Scrycards";
import { FOOODCard } from "./FOOOD";
import { ConfluenceCard } from "./Confluence";
import { ShahrazadCard } from "./Shahrazad";

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
                    className="h-fit gap-8 flex flex-row justify-around items-center overflow-auto
                    [mask-image:linear-gradient(to_right,transparent,black_20%,black_60%,transparent)] 
                    [webkit-mask:linear-gradient(to_right,transparent,black_20%,black_60%,transparent)]"
                    style={{
                        scrollbarWidth: "none",
                    }}
                >
                    <div className="min-w-[45%]" />
                    <ProjectCard
                        id="Scrycards"
                        colorNum={1}
                        parent={scrollable_ref}
                    >
                        <ScrycardsCard />
                    </ProjectCard>
                    <ProjectCard
                        id="FOOOD"
                        colorNum={2}
                        parent={scrollable_ref}
                    >
                        <FOOODCard />
                    </ProjectCard>
                    <ProjectCard
                        id="Confluence"
                        colorNum={3}
                        parent={scrollable_ref}
                    >
                        <ConfluenceCard />
                    </ProjectCard>
                    <ProjectCard
                        id="Shahrazad"
                        colorNum={4}
                        parent={scrollable_ref}
                    >
                        <ShahrazadCard />
                    </ProjectCard>
                    <div className="min-w-[45%]" />
                </div>
            </div>
        </div>
    );
}
