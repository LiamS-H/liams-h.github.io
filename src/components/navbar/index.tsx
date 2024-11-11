import { NavLink, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import Hitbox from "../hitbox";

function NavBarButton(props: { path: string; label: string; active: boolean }) {
    return (
        <NavLink to={props.path}>
            <Hitbox
                id={props.path}
                className={`rounded p-4 mb-4 ${
                    props.active
                        ? "bg-black text-purple-600"
                        : "bg-black text-white hover:text-pink-500"
                }`}
            >
                <li key={props.path}>{props.label}</li>
            </Hitbox>
        </NavLink>
    );
}

export default function NavBar() {
    const location = useLocation();
    return (
        <nav className="fixed bottom-0 w-full">
            <ul className="flex justify-around">
                {routes.map((r) => (
                    <NavBarButton
                        key={r.path}
                        path={r.path}
                        label={r.label}
                        active={location.pathname === r.path}
                    />
                ))}
            </ul>
        </nav>
    );
}
