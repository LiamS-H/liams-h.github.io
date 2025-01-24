import { ReactNode, useEffect, useRef, useState } from "react";
import { Simulator } from "./sim";
import { useFluidContextHost } from "../../contexts/fluid";
import { useWindowFocus } from "../../contexts/focus";

export default function Water(props: { children: ReactNode }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const sim = useRef<Simulator | null | undefined>(undefined);
    const [initialized, setInitialized] = useState(false);
    const { provider, rects, text, color } = useFluidContextHost();
    const focus = useWindowFocus();
    const [canvasW, setCanvasW] = useState(
        window.visualViewport?.width || window.innerWidth
    );
    const [canvasH, setCanvasH] = useState(
        window.visualViewport?.height || window.innerHeight
    );

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
            const minW = 4;
            const minH = 4;

            const vw = window.visualViewport?.width || window.innerWidth;
            const vh = window.visualViewport?.height || window.innerHeight;
            setCanvasH(vh);
            setCanvasW(vw);

            canvas.width = Math.max(vw, minW);
            canvas.height = Math.max(vh, minH);
            setInitialized(false);
            await sim.current?.resize();
            setInitialized(true);
        }

        function mouseMove(e: MouseEvent) {
            const vh = window.visualViewport?.height || window.innerHeight;
            const vw = window.visualViewport?.width || window.innerWidth;

            if (!sim.current) return;
            sim.current.updateMouse(e.clientX / vw, e.clientY / vh);
        }
        function touchMove(e: TouchEvent) {
            const vw = window.visualViewport?.width || window.innerWidth;
            const vh = window.visualViewport?.height || window.innerHeight;
            if (!sim.current) return;
            const touch = e.touches[0];
            sim.current.updateMouse(touch.clientX / vw, touch.clientY / vh);
        }
        sim.current = await Simulator.create(canvas);

        const controller = new AbortController();

        window.addEventListener("resize", resizeCanvas, {
            signal: controller.signal,
        });
        window.addEventListener("mousemove", mouseMove, {
            signal: controller.signal,
        });
        window.addEventListener("touchmove", touchMove, {
            signal: controller.signal,
        });

        setInitialized(true);
        return () => controller.abort();
    }

    useEffect(() => {
        function animate() {
            requestAnimationFrame(animate);
            if (!focus) return;
            if (!sim.current) return;
            if (!sim.current.isInitialized()) return;

            sim.current.step();
        }
        if (!focus) return;
        requestAnimationFrame(animate);
    }, [focus]);

    useEffect(() => {
        if (initialized) return;
        if (!canvas.current) return;
        if (sim.current !== undefined) return;
        sim.current = null;
        const abortPromise = init(canvas.current);
        const cleanup = async () => {
            if (!sim.current) return;
            const abort = await abortPromise;
            abort();
        };

        return () => {
            cleanup();
        };
    }, [initialized]);

    if (sim.current?.isBroken()) {
        console.error("sim is broken");
        return null;
    }

    return (
        <>
            <div className="absolute top-0 left-0 -z-10">
                <canvas
                    ref={canvas}
                    style={{
                        width: `${canvasW}px`,
                        height: `${canvasH}px`,
                    }}
                />
            </div>

            {provider({ ...props })}
        </>
    );
}
