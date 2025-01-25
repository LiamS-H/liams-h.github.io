import { Link, useLocation } from "react-router-dom";

export default function NoGPUModal({ text }: { text: string }) {
    const { pathname } = useLocation();
    return (
        <>
            {pathname !== "/webgpu" && (
                <h1 className="text-white/20 absolute top-0 group text-[18px] sm:text-2xl md:text-3xl">
                    <Link to="/webgpu">
                        WebGPU Not Enabled -{" "}
                        <span className="text-cyan-500/50 underline transition-colors group-hover:text-cyan-500">
                            What am I missing out on?
                        </span>
                    </Link>
                </h1>
            )}
            <div className="absolute top-0 left-0 -z-10 w-full h-full">
                <div className="flex justify-center w-full h-full items-center bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient-swirl">
                    <h1 className="text-black text-[180px] md:text-[240px] lg:text-[400px] font-[Megrim]">
                        {text}
                    </h1>
                </div>
            </div>
        </>
    );
}
