import {
    createContext,
    type ReactNode,
    type RefObject,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { FluidRect, FluidRects } from "@/types/fluid";
import { Simulator } from "@/components/fluid/sim";

interface FluidContext {
    registerBound: (bounds: DOMRect | null, id: string) => void;
    registerText: (text: string) => void;
    changeColor: (color: number) => void;
    text: string;
}

const fluidContext = createContext<FluidContext | null>(null);

export function FluidContextHost(sim: RefObject<Simulator | null | undefined>) {
    const color = useRef<number>(0);

    const text = useRef<string>("");
    const [displayText, setDisplayText] = useState("");
    const rectMap = useRef<FluidRects>(new Map<string, FluidRect>());

    const registerBound = useCallback((bounds: DOMRect | null, id: string) => {
        if (!bounds) {
            rectMap.current.delete(id);
            return;
        }
        const vh = window.visualViewport?.height || window.innerHeight;
        const vw = window.visualViewport?.width || window.innerWidth;

        const rect: FluidRect = {
            x: bounds.x / vw,
            y: (vh - bounds.height - bounds.y) / vh,
            w: bounds.width / vw,
            h: bounds.height / vh,
        };

        rectMap.current.set(id, rect);
    }, []);

    const registerText = useCallback(
        (new_text: string) => {
            if (new_text === text.current) return;
            text.current = new_text;
            sim.current?.updateTextMatte(new_text);
            setDisplayText(new_text);
        },
        [text, sim]
    );

    const changeColor = useCallback(
        (new_color: number) => {
            if (new_color === color.current) return;
            color.current = new_color;
            sim.current?.updateColor(new_color);
        },
        [color, sim]
    );

    const FluidProvider = useCallback(
        (props: { children: ReactNode }) => (
            <fluidContext.Provider
                value={{
                    registerBound,
                    registerText,
                    changeColor,
                    text: displayText,
                }}
            >
                {props.children}
            </fluidContext.Provider>
        ),
        [registerBound, registerText, changeColor, displayText]
    );
    return { FluidProvider, rectMap };
}

export function useFluidContext(): FluidContext {
    const context = useContext(fluidContext);
    if (context === null) {
        throw Error("useFluidContext() must be called inside provider");
    }
    return context;
}

export function useFluidTextRegister(text: string) {
    const { registerText } = useFluidContext();
    useEffect(() => {
        registerText(text);
        return () => {
            registerText("");
        };
    }, [text, registerText]);
}

export function useFluidColorRegister(color: number) {
    const { changeColor } = useFluidContext();
    useEffect(() => {
        changeColor(color);
        return () => {
            changeColor(0);
        };
    }, [color, changeColor]);
}
