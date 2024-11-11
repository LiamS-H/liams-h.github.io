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
}

const fluidContext = createContext<FluidContext | null>(null);

export function fluidContextHost(): {
    provider: (props: { children?: ReactNode }) => JSX.Element;
    rects: FluidRectList;
    text: string;
} {
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
        <fluidContext.Provider value={{ registerBound, registerText }}>
            {props.children}
        </fluidContext.Provider>
    );
    return { provider, rects, text };
}

function useFluidContext(): FluidContext {
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
        return {
            x: bounds.x / window.innerWidth,
            y:
                (window.innerHeight - bounds.height - bounds.y) /
                window.innerHeight,
            w: bounds.width / window.innerWidth,
            h: bounds.height / window.innerHeight,
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
