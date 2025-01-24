import ExternalLink from "@/components/external-link";

export function ShahrazadCard() {
    return (
        <>
            <h1 className="text-4xl">Shahrazad</h1>
            <p>Public realtime multiplayer table top game simulator.</p>
            <i>Rich drag and drop features.</i>
            <div className="flex align-middle justify-center flex-row space-x-4">
                <ExternalLink href="https://shahrazad.vercel.app">
                    Vist Site
                </ExternalLink>
            </div>
        </>
    );
}
