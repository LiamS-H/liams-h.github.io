import {
    HTMLProps,
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { useFluidContext } from "../contexts/fluid";

// TO DO: add callback for updating hitbox
export default function Hitbox(
    props: {
        id: string;
        innerBounds?: boolean;
        parent?: MutableRefObject<HTMLDivElement | null>;
    } & HTMLProps<HTMLDivElement>
) {
    const { innerBounds, id, parent, ...divprops } = props;
    const boundRef = useRef<HTMLDivElement | null>(null);
    const { registerBound } = useFluidContext();

    const calcBounds = useCallback(
        function () {
            if (!boundRef.current) {
                registerBound(null, id);
                return;
            }
            let rect = boundRef.current.getBoundingClientRect();
            if (innerBounds) {
                const range = document.createRange();
                range.selectNodeContents(boundRef.current);
                rect = range.getBoundingClientRect();
                range.detach();
            }
            if (parent?.current) {
                const pRect = parent.current.getBoundingClientRect();

                const new_x = Math.max(pRect.x, rect.x);
                rect.width += rect.x - new_x;
                rect.x = new_x;
                rect.width =
                    Math.min(pRect.x + pRect.width, rect.x + rect.width) -
                    rect.x;

                const new_y = Math.max(pRect.y, rect.y);
                rect.height += rect.y - new_y;
                rect.y = new_y;
                rect.height =
                    Math.min(pRect.y + pRect.height, rect.y + rect.height) -
                    rect.y;
            }
            registerBound(rect, id);
        },
        [innerBounds, parent, id, registerBound]
    );

    useEffect(() => {
        if (!boundRef.current) return;
        calcBounds();
        const observer = new ResizeObserver(calcBounds);
        observer.observe(boundRef.current);
        const controller = new AbortController();
        window.addEventListener("resize", calcBounds, {
            signal: controller.signal,
        });
        if (parent?.current) {
            parent.current.addEventListener("scroll", calcBounds, {
                signal: controller.signal,
            });
        }
        return () => {
            registerBound(null, id);
            // console.log("deleting:", id);
            controller.abort();
        };
    }, [calcBounds, parent, id, registerBound]);

    return <div {...divprops} ref={boundRef} />;
}
