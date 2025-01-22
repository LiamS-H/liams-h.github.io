import {
    HTMLProps,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from "react";
import { useFluidBoundRegister } from "../../contexts/fluid";

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
    const [bounds, setBounds] = useState<DOMRect | undefined>();

    useFluidBoundRegister(bounds, id);
    function calcBounds() {
        if (!boundRef.current) return;
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
                Math.min(pRect.x + pRect.width, rect.x + rect.width) - rect.x;

            const new_y = Math.max(pRect.y, rect.y);
            rect.height += rect.y - new_y;
            rect.y = new_y;
            rect.height =
                Math.min(pRect.y + pRect.height, rect.y + rect.height) - rect.y;
        }
        setBounds(rect);
    }

    useEffect(() => {
        if (!boundRef.current) return;
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
            controller.abort();
        };
    }, []);

    return <div {...divprops} ref={boundRef} />;
}
