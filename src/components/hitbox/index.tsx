import { HTMLProps, useRef } from "react";
import { useFluidBoundRegister } from "../../contexts/fluid";

export default function Hitbox(
    props: { id: string; innnerBounds?: true } & HTMLProps<HTMLDivElement>
) {
    const boundRef = useRef<HTMLDivElement | null>(null);
    // const boundRect = useMemo(
    //     () => boundRef.current?.getBoundingClientRect(),
    //     [boundRef.current]
    // );
    let boundRect = boundRef.current?.getBoundingClientRect();
    if (boundRef.current && props.innnerBounds) {
        const range = document.createRange();
        range.selectNodeContents(boundRef.current);
        boundRect = range.getBoundingClientRect();
        range.detach();
    }

    useFluidBoundRegister(boundRect, props.id);

    return <div className="w-fit h-fit" ref={boundRef} {...props} />;
}
