import { HTMLProps, useRef } from "react";
import { useFluidBoundRegister } from "../../contexts/fluid";

// TO DO: add callback for updating hitbox
export default function Hitbox(
    props: { id: string; innnerBounds?: boolean } & HTMLProps<HTMLDivElement>
) {
    const { innnerBounds, id, ...divprops } = props;
    const boundRef = useRef<HTMLDivElement | null>(null);
    // const boundRect = useMemo(
    //     () => boundRef.current?.getBoundingClientRect(),
    //     [boundRef.current]
    // );
    let boundRect = boundRef.current?.getBoundingClientRect();
    if (boundRef.current && innnerBounds) {
        const range = document.createRange();
        range.selectNodeContents(boundRef.current);
        boundRect = range.getBoundingClientRect();
        range.detach();
    }

    useFluidBoundRegister(boundRect, id);

    return <div className="w-fit h-fit" {...divprops} ref={boundRef} />;
}
