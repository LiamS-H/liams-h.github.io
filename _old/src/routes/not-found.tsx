import Hitbox from "@/components/hitbox";
import InternalLink from "@/components/internal-link";

export default function NotFound() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Hitbox id="not-found" className="p-4 flex flex-col items-center">
                <h1 className="text-9xl">404</h1>
                <p>page not found.</p>
                <InternalLink to="/">Go Home</InternalLink>
            </Hitbox>
        </div>
    );
}
