import { useEffect, useRef, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { ScrycardsCard } from "./Scrycards";
import { FOOODCard } from "./FOOOD";
import { ConfluenceCard } from "./Confluence";
import { ShahrazadCard } from "./Shahrazad";

function debounce<F extends (...args: unknown[]) => unknown>(
    func: F,
    delay: number
) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return function (this: unknown, ...args: Parameters<F>) {
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

        const debouncedHandleScroll = debounce(handleScroll, 50);

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
                            aria-label="previous project"
                        >
                            <ArrowLeft />
                        </button>
                    </div>
                    <div className="absolute right-4 top-1/2 transform md:static md:left-auto md:top-auto z-10">
                        <button
                            onClick={() => navigateProject("right")}
                            disabled={currentIndex === totalChildren - 2}
                            className="p-2 rounded-full disabled:opacity-50"
                            aria-label="next project"
                        >
                            <ArrowRight />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollable_ref}
                    className="h-fit gap-8 md:gap-24 flex flex-row justify-around items-center overflow-x-auto relative
                    [mask-image:linear-gradient(to_right,transparent,black_20%,black_60%,transparent)] 
                    [webkit-mask:linear-gradient(to_right,transparent,black_20%,black_60%,transparent)]"
                    style={{
                        scrollbarWidth: "none",
                    }}
                >
                    <div className="min-w-[45%]" />

                    <ShahrazadCard scrollable_ref={scrollable_ref} />

                    <FOOODCard scrollable_ref={scrollable_ref} />

                    <ScrycardsCard scrollable_ref={scrollable_ref} />

                    <ConfluenceCard scrollable_ref={scrollable_ref} />

                    <div className="min-w-[45%]" />
                </div>
            </div>
        </div>
    );
}
