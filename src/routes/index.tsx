import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./root";
import Home from "./Home";
import About from "./About";
import Projects from "./Projects";

export const routes = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
];

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="" Component={Root}>
                    <Route path="/" Component={Home} />
                    <Route path="/about" Component={About} />
                    <Route path="/projects" Component={Projects} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
