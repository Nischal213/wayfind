import { IoDesktopOutline, IoCodeSharp, IoGitNetwork, IoArrowForward } from "react-icons/io5";

export default function FallbackPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#F8F8F7]">
            <div className="flex flex-col bg-white max-w-md md:max-w-lg lg:max-w-xl w-[90%] items-center rounded-2xl shadow-xl shadow-neutral-200/50 p-8 md:p-12 animate-fade-in-up [--delay:0.2s]">
                <div className="flex gap-4 mb-6">
                    <IoDesktopOutline className="text-neutral-800 animate-fade-in-up [--delay:0.1s]" size={50} />
                </div>

                <h1 className="text-neutral-400 text-xs font-semibold tracking-widest uppercase mb-2 animate-fade-in-up [--delay:0.1s]">Desktop Required</h1>

                <h2 className="text-lg md:text-xl font-bold text-neutral-900 text-center mb-3 animate-fade-in-up [--delay:0.2s]">Your canvas is waiting</h2>

                <p className="text-neutral-600 text-center text-xs md:text-sm mb-5 max-w-xs md:max-w-sm leading-relaxed animate-fade-in-up [--delay:0.3s]">
                    Building and connecting nodes needs the precision of a desktop. Open this page on your computer to get started.
                </p>

                <div className="flex gap-6 mb-5">
                    <div className="flex flex-col items-center animate-fade-in-up [--delay:0.2s]">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-2">
                            <IoCodeSharp className="text-neutral-700" size={20} />
                        </div>
                        <span className="text-neutral-500 text-xs">Nodes</span>
                    </div>
                    <div className="flex flex-col items-center animate-fade-in-up [--delay:0.3s]">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-2">
                            <IoGitNetwork className="text-neutral-700 " size={20} />
                        </div>
                        <span className="text-neutral-500 text-xs">Edges</span>
                    </div>
                    <div className="flex flex-col items-center animate-fade-in-up [--delay:0.4s]">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-2">
                            <IoArrowForward className="text-neutral-700" size={20} />
                        </div>
                        <span className="text-neutral-500 text-xs">Paths</span>
                    </div>
                </div>

                <div className="w-full h-px bg-neutral-200 mb-6 animate-fade-in-up [--delay:0.5s]" />

                <p className="text-neutral-400 text-center text-xs animate-fade-in-up [--delay:0.5s]">Works best on a 1280px+ display</p>
            </div>
        </div>
    )
}