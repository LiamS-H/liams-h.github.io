import Hitbox from "../../components/hitbox";
import { useFluidTextRegister } from "../../contexts/fluid";

export default function Home() {
    useFluidTextRegister("Liam");
    return null;
    return (
        <div className="flex w-full h-full flex-col justify-start items-center box-border z-0">
            <Hitbox id="Hello World">
                <h1 className="text-white">Hello World</h1>
            </Hitbox>
        </div>
    );
}
