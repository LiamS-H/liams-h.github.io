import { useFluidColorRegister, useFluidTextRegister } from "@/contexts/fluid";

export default function Home() {
    useFluidColorRegister(0);
    useFluidTextRegister("Liam");
    return null;
}
