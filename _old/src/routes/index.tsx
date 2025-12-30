import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./root";
import Home from "./Home";
import About from "./About";
import Projects from "./Projects";
import WebGPU from "./WebGPU";
import Shahrazad from "./Projects/Shahrazad";
import NotFound from "./not-found";
import Confluence from "./Projects/Confluence";
import FOOD from "./Projects/FOOOD";
import Scrycards from "./Projects/Scrycards";
import Ribbons from "./Projects/Ribbons";

export const routes = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
];

export default function Router() {
    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                <Route path="" Component={Root}>
                    <Route path="/" Component={Home} />
                    <Route path="/about" Component={About} />
                    <Route path="/webgpu" Component={WebGPU} />
                    <Route path="/projects" Component={Projects}></Route>
                    <Route path="/projects/shahrazad" Component={Shahrazad} />
                    <Route path="/projects/confluence" Component={Confluence} />
                    <Route path="/projects/food" Component={FOOD} />
                    <Route path="/projects/scrycards" Component={Scrycards} />
                    <Route path="/projects/ribbons" Component={Ribbons} />
                    <Route path="*" Component={NotFound} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
