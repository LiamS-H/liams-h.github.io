export default function WebGPU() {
    return (
        <div className="w-full flex justify-center pt-20 px-8">
            <div className="w-full md:w-1/3 text-lg flex flex-col gap-8">
                <div className="bg-black rounded-lg p-8 text-purple-300">
                    <h1>Easy Fix</h1>
                    <p className="pt-2 font-bold">Move to Chrome or Edge.</p>
                </div>

                <div className="bg-black rounded-lg p-8 pt-2">
                    <span>What You're Missing:</span>
                </div>
                <div className="bg-black rounded-lg p-8">
                    <h1>WebGPU</h1>
                    <p>
                        I picked WebGPU because I already had some familiarity
                        with WebGL and wanted to learn something new. While
                        WebGPU is supported fully on Chrome, and Edge, its not
                        quite ready for Firefox, and requires a flag or preview
                        build on Safari.
                    </p>
                </div>
            </div>
        </div>
    );
}
