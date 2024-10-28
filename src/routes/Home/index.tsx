import Hitbox from "../../components/hitbox";

export default function Home() {
    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                height: "100%",
                flexFlow: "column nowrap",
                justifyContent: "flex-end",
                alignItems: "center",
                boxSizing: "border-box",
            }}
        >
            <Hitbox id="Hellow World">
                <h1>Hello World</h1>
            </Hitbox>
        </div>
    );
}
