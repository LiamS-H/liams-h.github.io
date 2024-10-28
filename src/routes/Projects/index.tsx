export default function Projects() {
    return (
        <div style={{ display: "flex", flexFlow: "row wrap" }}>
            <div className="project-card">
                <h1>Scrycards</h1>
                <a
                    target="_blank"
                    href="https://github.com/LiamS-H/react-scrycards"
                >
                    Github
                </a>
                <p>
                    Wraps{" "}
                    <a target="_blank" href="https://scryfall.com/docs/api">
                        Scryfall API
                    </a>
                    in a lightweight cache and provides react components for
                    rendering the returned data. Dependency injection allows for
                    using custom caches, or API wrappers / endpoints.
                </p>
            </div>
        </div>
    );
}
