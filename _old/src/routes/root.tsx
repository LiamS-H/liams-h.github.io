import { Outlet } from "react-router-dom";
import Water from "../components/fluid";
import { WindowFocusProvider } from "../contexts/focus";
import NavBar from "./navbar";

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
