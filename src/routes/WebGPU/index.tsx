import demoGif from "@/assets/portfolioDemo.gif";

export default function WebGPU() {
    return (
        <div
            style={{
                maskImage:
                    "linear-gradient(to top, transparent, black 10%, black 80%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(to top, transparent, black 8%, black 92%, transparent)",
            }}
            className="w-full flex justify-center pt-2 md:pt-10 px-8 h-[90%] overflow-y-auto"
        >
            <div className="w-full md:max-w-xl text-lg flex flex-col items-center gap-4 ">
                <div className="bg-black min-x-lg rounded-lg p-8 text-purple-300">
                    <h1>Easy Fix</h1>
                    <p className="pt-2 font-bold text-purple-500">
                        Move to Chrome or Edge.
                    </p>
                </div>

                <div className="bg-black rounded-lg p-8">
                    <h1>WebGPU</h1>
                    <i className="text-pink-300">
                        My website is designed to interact with a WebGPU fluid
                        simulation; the fallback cannot compare to the full
                        site.
                    </i>
                    <p>
                        I picked WebGPU because I already had some familiarity
                        with WebGL and wanted to build with something new. While
                        WebGPU is supported fully on Chrome, and Edge, it
                        requires a flag or preview build on Safari or Firefox.
                    </p>
                </div>
                <div className="bg-black relative rounded-lg p-2 w-fit">
                    <span className="absolute top-2 left-4 text-black">
                        what you're missing :(
                    </span>
                    <img className="rounded-md" src={demoGif} />
                </div>
                <div className="min-h-[20%] md:absolute" />
            </div>
            <div className="min-h-[20%] md:absolute" />
        </div>
    );
}
