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

type FluidRects = Map<string, FluidRect>;

interface FluidContext {
    registerBound: (rect: FluidRect, id: string) => void;
}

const fluidContext = createContext<FluidContext | null>(null);

export function fluidContextHost(): {
    provider: (props: { children?: ReactNode }) => JSX.Element;
    rects: FluidRectList;
} {
    const [rectMap, setRectMap] = useState<FluidRects>(
        new Map<string, FluidRect>()
    );
    const rects = useMemo<FluidRectList>(() => {
        const rectList: FluidRectList = [];

        rectMap.forEach((rect) => {
            rectList.push([rect.x, rect.y, rect.w, rect.h]);
        });
        return rectList;
    }, [rectMap]);

    const registerBound = useCallback(
        (rect: FluidRect, id: string) => {
            setRectMap((old_rects) => {
                const new_rects = new Map(old_rects);
                new_rects.set(id, rect);
                return new_rects;
            });
        },
        [setRectMap]
    );

    const provider = (props: { children?: ReactNode }) => (
        <fluidContext.Provider value={{ registerBound }}>
            {props.children}
        </fluidContext.Provider>
    );
    return { provider, rects };
}

function useFluidContext(): FluidContext {
    const context = useContext(fluidContext);
    if (context === null) {
        throw Error("useFluidContext() must be called inside provider");
    }
    return context;
}

export function useFluidRegister(bounds: DOMRect | undefined, id: string) {
    const { registerBound } = useFluidContext();
    const rect: FluidRect = useMemo(() => {
        if (!bounds) return { x: 0, y: 0, w: 0, h: 0 };
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
    }, [rect]);
}
