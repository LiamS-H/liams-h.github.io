import ExternalLink from "@/components/external-link";

export function ConfluenceCard() {
    return (
        <>
            <h1 className="text-4xl">Confluence</h1>
            <p>
                Public website with visual tools and syntax for advanced
                Scryfall database queries.
            </p>
            <div className="flex align-middle justify-center flex-row space-x-4">
                <ExternalLink href="https://card-confluence.web.app/about">
                    Vist Site
                </ExternalLink>
            </div>
        </>
    );
}
