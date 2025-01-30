import { type ReactNode, useEffect, useRef, useState } from "react";
import { Simulator } from "./sim";
import { FluidContextHost } from "../../contexts/fluid";
import { useWindowFocus } from "../../contexts/focus";
import NoGPUModal from "./nogpupage";

export default function Water({ children }: { children: ReactNode }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const sim = useRef<Simulator | null | undefined>(undefined);
    const [initialized, setInitialized] = useState(false);
    const { FluidProvider, rectMap } = FluidContextHost(sim, initialized);
    const [error, setError] = useState(false);
    const focus = useWindowFocus();
    const [canvasW, setCanvasW] = useState(
        window.visualViewport?.width || window.innerWidth
    );
    const [canvasH, setCanvasH] = useState(
        window.visualViewport?.height || window.innerHeight
    );
    const controller_ref = useRef(new AbortController());

    async function init(canvas: HTMLCanvasElement) {
        sim.current = await Simulator.create(canvas, rectMap);
        if (sim.current === null) {
            setError(true);
            return;
        }
        setInitialized(true);
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
        if (!initialized) return;
        async function resizeCanvas() {
            if (!canvas.current) return;
            console.log("resizing");
            const minW = 4;
            const minH = 4;

            const vw = window.visualViewport?.width || window.innerWidth;
            const vh = window.visualViewport?.height || window.innerHeight;
            setCanvasH(vh);
            setCanvasW(vw);

            canvas.current.width = Math.max(vw, minW);
            canvas.current.height = Math.max(vh, minH);
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
            sim.current.updateMouse(
                touch.clientX / vw,
                touch.clientY / vh,
                true
            );
        }

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
        return () => {
            controller.abort();
        };
    }, [initialized]);

    useEffect(() => {
        const controller = controller_ref.current;
        if (initialized) {
            return () => {
                console.log("aborting");
                controller.abort();
            };
        }
        if (!canvas.current) return;
        if (sim.current !== undefined) return;
        sim.current = null;
        init(canvas.current);
    }, [initialized]); // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return (
            <FluidProvider>
                {children}
                <NoGPUModal />
            </FluidProvider>
        );
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

            <FluidProvider>{children}</FluidProvider>
        </>
    );
}
