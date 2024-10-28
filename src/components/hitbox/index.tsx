import { ReactNode, useRef } from "react";
import { useFluidRegister } from "../../contexts/fluid";

export default function Hitbox(props: { id: string; children?: ReactNode }) {
    const boundRef = useRef<HTMLDivElement | null>(null);
    // const boundRect = useMemo(
    //     () => boundRef.current?.getBoundingClientRect(),
    //     [boundRef.current]
    // );
    let boundRect = undefined;
    if (boundRef.current) {
        const range = document.createRange();
        range.selectNodeContents(boundRef.current);
        boundRect = range.getBoundingClientRect();
        range.detach();
    }

    useFluidRegister(boundRect, props.id);

    return <div ref={boundRef}>{props.children}</div>;
}
