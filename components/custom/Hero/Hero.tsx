"use client"

import { HiCursorClick } from "react-icons/hi";
import { MdKeyboardAlt } from "react-icons/md";
import { GrNetwork } from "react-icons/gr";
import { LoginCard } from "./LoginCard";

export const Hero = () => {
    return (
        <div className="flex bg-[#fbfbfb]/98">
            <div className="flex flex-col w-[50%] gap-y-10 items-center justify-center bg-[#262624] h-dvh">
                <div className="flex flex-col gap-y-5 items-center w-[80%]">
                    <h1 className="text-5xl text-pretty [word-spacing:-0.2em]">Draw,describe, <span className="text-blue-500 whitespace-nowrap"> find the path. </span> </h1>
                </div>

                <div className="flex flex-col gap-y-3 w-[80%]">
                    <div className="flex flex-col gap-y-4 w-full max-w-xl">
                        <div className="flex gap-x-4 items-center p-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300">
                            <div className="bg-blue-500/20 p-3 rounded-lg">
                                <HiCursorClick size={24} className="text-blue-400" />
                            </div>
                            <p className="text-md"> <strong> Visual canvas </strong>  — <span className="text-neutral-300"> drag and connect nodes with a click </span> </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-4 w-full max-w-xl">
                        <div className="flex gap-x-4 items-center p-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300">
                            <div className="bg-blue-400/20 p-3 rounded-lg">
                                <MdKeyboardAlt size={24} className="text-blue-400" />
                            </div>
                            <p className="text-md"> <strong> Natural language input </strong> — <span className="text-neutral-300"> describe your network in plain English </span> </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-4 w-full max-w-xl">
                        <div className="flex gap-x-4 items-center p-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300">
                            <div className="bg-blue-400/20 p-3 rounded-lg">
                                <GrNetwork size={24} className="text-blue-400" />
                            </div>
                            <p className="text-md"> <strong> Graph pathfinding </strong> — <span className="text-neutral-300"> get the shortest path instantly </span> </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-[50%] h-[50%] my-auto items-center justify-center ">
                <LoginCard></LoginCard>
            </div>
        </div>
    )
}