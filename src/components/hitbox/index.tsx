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
        if (parent?.current) {
            const pRect = parent.current.getBoundingClientRect();
            const new_x = Math.max(pRect.x, rect.x);
            rect.width += rect.x - new_x;
            rect.x = new_x;
            rect.width =
                Math.min(pRect.x + pRect.width, rect.x + rect.width) - rect.x;
        }
        if (innerBounds) {
            const range = document.createRange();
            range.selectNodeContents(boundRef.current);
            rect = range.getBoundingClientRect();
            range.detach();
        }
        setBounds(rect);
    }

    useEffect(() => {
        if (!boundRef.current) return;
        const observer = new ResizeObserver(calcBounds);
        observer.observe(boundRef.current);
        if (!parent?.current) return;
        parent.current.addEventListener("scroll", calcBounds);
    }, []);

    return <div {...divprops} ref={boundRef} />;
}
