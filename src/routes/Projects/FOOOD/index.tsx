import ExternalLink from "@/components/external-link";

export function FOOODCard() {
    return (
        <>
            <h1 className="text-5xl">FoodML</h1>
            <p>
                A machine learning full stack project for estimating caloric
                data from images.
                <br />
                <i>1st place HackMecedIX.</i>
            </p>
            <div className="flex align-middle justify-center flex-row space-x-4">
                <ExternalLink href="https://devpost.com/software/foooood">
                    Devpost
                </ExternalLink>
            </div>
        </>
    );
}
