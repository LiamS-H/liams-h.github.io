import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { FluidRect, FluidRectList } from "../types/fluid";

type FluidRects = Map<string, FluidRect | null>;

interface FluidContext {
    registerBound: (rect: FluidRect | null, id: string) => void;
    registerText: (text: string) => void;
    changeColor: (color: number) => void;
}

const fluidContext = createContext<FluidContext | null>(null);

export function useFluidContextHost(): {
    provider: (props: { children?: ReactNode }) => JSX.Element;
    rects: FluidRectList;
    text: string;
    color: number;
} {
    const [color, setColor] = useState<number>(0);
    const changeColor = useCallback(setColor, []);

    const [text, setText] = useState<string>("");
    const [rectMap, setRectMap] = useState<FluidRects>(
        new Map<string, FluidRect>()
    );

    const rects = useMemo<FluidRectList>(() => {
        const rectList: FluidRectList = [];

        rectMap.forEach((rect) => {
            if (!rect) return;
            rectList.push([rect.x, rect.y, rect.w, rect.h]);
        });
        return rectList;
    }, [rectMap]);

    const registerBound = useCallback(
        (rect: FluidRect | null, id: string) => {
            setRectMap((old_rects) => {
                const new_rects = new Map(old_rects);
                new_rects.set(id, rect);
                return new_rects;
            });
        },
        [setRectMap]
    );

    const registerText = useCallback(
        (text: string) => {
            setText(text);
        },
        [setText]
    );

    const provider = (props: { children?: ReactNode }) => (
        <fluidContext.Provider
            value={{ registerBound, registerText, changeColor }}
        >
            {props.children}
        </fluidContext.Provider>
    );
    return { provider, rects, text, color };
}

export function useFluidContext(): FluidContext {
    const context = useContext(fluidContext);
    if (context === null) {
        throw Error("useFluidContext() must be called inside provider");
    }
    return context;
}

export function useFluidBoundRegister(bounds: DOMRect | undefined, id: string) {
    const { registerBound } = useFluidContext();
    const rect: FluidRect | null = useMemo(() => {
        if (!bounds) return null;
        const vw = window.visualViewport?.width || window.innerWidth;
        const vh = window.visualViewport?.height || window.innerHeight;
        return {
            x: bounds.x / vw,
            y: (vh - bounds.height - bounds.y) / vh,
            w: bounds.width / vw,
            h: bounds.height / vh,
        };
    }, [bounds?.x, bounds?.y, bounds?.width, bounds?.height]);

    useEffect(() => {
        registerBound(rect, id);
        return () => {
            registerBound(null, id);
        };
    }, [rect]);
}

export function useFluidTextRegister(text: string) {
    const { registerText } = useFluidContext();
    useEffect(() => {
        registerText(text);
        return () => {
            registerText("");
        };
    }, [text]);
}
