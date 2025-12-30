import { NavLink, useLocation } from "react-router-dom";
import { routes } from ".";
import Hitbox from "../components/hitbox";

function NavBarButton(props: {
    path: string;
    label: string;
    active: null | boolean;
}) {
    return (
        <NavLink
            to={props.path}
            className={
                props.active === null
                    ? undefined
                    : props.active
                    ? "cursor-default"
                    : undefined
            }
        >
            <Hitbox
                id={props.path}
                className={`bg-black p-4 mb-4 transition-colors ${
                    props.active === null
                        ? "text-orange-400"
                        : props.active
                        ? " text-purple-600"
                        : " text-white hover:text-pink-500"
                }`}
            >
                <li key={props.path}>{props.label}</li>
            </Hitbox>
        </NavLink>
    );
}

function match(path: string, path2: string) {
    if (path2 === "/") {
        return path === path2;
    }
    if (path === path2) {
        return true;
    }
    if (path.startsWith(path2)) {
        return null;
    }
    return false;
}

export default function NavBar() {
    const { pathname } = useLocation();

    return (
        <nav className="fixed bottom-0 w-full md:px-[20%]">
            <ul className="flex justify-around">
                {routes.map((r) => (
                    <NavBarButton
                        key={r.path}
                        path={r.path}
                        label={r.label}
                        active={match(pathname, r.path)}
                    />
                ))}
            </ul>
        </nav>
    );
}
