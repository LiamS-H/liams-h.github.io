import {
    useState,
    useEffect,
    useContext,
    createContext,
    ReactNode,
} from "react";

const WindowFocusContext = createContext<boolean | null>(null);

export function WindowFocusProvider(props: { children: ReactNode }) {
    const [isWindowFocused, setIsWindowFocused] = useState<boolean>(
        document.hasFocus()
    );

    useEffect(() => {
        const handleFocusChange = (focused: boolean) =>
            setIsWindowFocused(focused);

        const controller = new AbortController();

        window.addEventListener("focus", () => handleFocusChange(true), {
            signal: controller.signal,
        });
        window.addEventListener("blur", () => handleFocusChange(false), {
            signal: controller.signal,
        });
        window.addEventListener("pagehide", () => handleFocusChange(false), {
            signal: controller.signal,
        });
        window.addEventListener("pageshow", () => handleFocusChange(false), {
            signal: controller.signal,
        });
        document.addEventListener(
            "visibilitychange",
            () => handleFocusChange(document.visibilityState === "visible"),
            {
                signal: controller.signal,
            }
        );

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <WindowFocusContext.Provider value={isWindowFocused}>
            {props.children}
        </WindowFocusContext.Provider>
    );
}

export function useWindowFocus(): boolean {
    const context = useContext(WindowFocusContext);
    if (context === null) {
        throw Error("useWindowFocus() must be called in context");
    }
    return context;
}
