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

        const onFocus = () => handleFocusChange(true);
        const onBlur = () => handleFocusChange(false);
        const onVisibilityChange = () =>
            handleFocusChange(document.visibilityState === "visible");

        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange
            );
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
        throw Error("useWindowFocus() must be calle in context");
    }
    return context;
}
