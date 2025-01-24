import ExternalLink from "@/components/external-link";

export function ScrycardsCard() {
    return (
        <>
            <h1 className="text-5xl">Scrycards</h1>
            <p>
                A react component library that wraps a{" "}
                <ExternalLink href="https://scryfall.com/docs/api">
                    Public API
                </ExternalLink>{" "}
                and provides a lightweight cache + components.
            </p>
            <div className="flex justify-center flex-row space-x-4">
                <ExternalLink href="https://github.com/LiamS-H/react-scrycards">
                    Github
                </ExternalLink>
            </div>
        </>
    );
}
