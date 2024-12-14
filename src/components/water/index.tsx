import { ReactNode, useEffect, useRef, useState } from "react";
import "./water.css";
import { Simulator } from "./sim";
import { fluidContextHost } from "../../contexts/fluid";
import { useWindowFocus } from "../../contexts/focus";

export default function Water(props: { children: ReactNode }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const sim = useRef<Simulator | null | undefined>(undefined);
    const [initialized, setInitialized] = useState(false);
    const { provider, rects, text, color } = fluidContextHost();
    const focus = useWindowFocus();

    useEffect(() => {
        if (!sim.current) return;
        // console.log("updating rects:", rects);
        sim.current.updateRectangles(rects);
    }, [initialized, rects]);

    useEffect(() => {
        if (!sim.current) return;
        // console.log("updating rects:", rects);
        sim.current.updateTextMatte(text);
    }, [initialized, text]);

    useEffect(() => {
        if (!sim.current) return;
        // console.log("updating rects:", rects);
        sim.current.updateColor(color);
    }, [initialized, color]);

    async function init(canvas: HTMLCanvasElement) {
        // Resize handling
        async function resizeCanvas() {
            const minW = 400;
            const minH = 400;

            canvas.width = Math.max(window.innerWidth, minW);
            canvas.height = Math.max(window.innerHeight, minH);
            setInitialized(false);
            await sim.current?.resize();
            setInitialized(true);
        }

        sim.current = await Simulator.create(canvas);

        window.addEventListener("resize", resizeCanvas);

        setInitialized(true);
    }
    function animate() {
        requestAnimationFrame(animate);
        if (!focus) return;
        if (!sim.current) return;
        if (!sim.current.isInitialized()) return;

        sim.current.step();
    }

    useEffect(() => {
        if (!focus) return;
        requestAnimationFrame(animate);
    }, [focus]);

    useEffect(() => {
        if (initialized) return;
        if (!canvas.current) return;
        if (sim.current !== undefined) return;
        sim.current = null;

        init(canvas.current);
    }, []);

    if (sim.current?.isBroken()) {
        console.error("sim is broken");
        return null;
    }

    return (
        <>
            <div className="absolute top-0 left-0 -z-10">
                <canvas ref={canvas} />
            </div>

            {provider({ ...props })}
        </>
    );
}
