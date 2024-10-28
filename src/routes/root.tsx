import { Outlet } from "react-router-dom";
import Water from "../components/water";
import { WindowFocusProvider } from "../contexts/focus";

export default function Root() {
    return (
        <WindowFocusProvider>
            <Water>
                <Outlet />
            </Water>
        </WindowFocusProvider>
    );
}
