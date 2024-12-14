import { Outlet } from "react-router-dom";
import Water from "../components/water";
import { WindowFocusProvider } from "../contexts/focus";
import NavBar from "../components/navbar";

export default function Root() {
    return (
        <WindowFocusProvider>
            <Water>
                <Outlet />
                <NavBar />
            </Water>
        </WindowFocusProvider>
    );
}
