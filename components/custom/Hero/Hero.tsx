import { HiCursorClick } from "react-icons/hi";
import { MdKeyboardAlt } from "react-icons/md";
import { GrNetwork } from "react-icons/gr";
import { LoginCard } from "./LoginCard";

export const Hero = () => {
    return (
        <div className="flex">
            <div className="flex flex-col w-[50%] gap-y-10 items-center justify-center bg-[#30302e] h-dvh">
                <div className="flex flex-col gap-y-5 items-center w-[80%] mb-5">
                    <h1 className="text-6xl text-pretty [word-spacing:-0.2em]">Draw,describe, <span className="text-blue-500 whitespace-nowrap"> find the path. </span> </h1>
                    <p className="text-xl text-pretty text-neutral-300"> Wayfind lets you build graph networks visually or in plain English — then instantly find the shortest route between any two nodes. </p>
                </div>
                
                <div className="flex flex-col gap-y-3 w-[80%]">
                    <div className="flex gap-x-4 items-center">
                        <div className="bg-blue-400/90 p-1 rounded-lg">
                            <HiCursorClick size={24}></HiCursorClick>
                        </div>
                        <p className="text-lg"> <strong> Visual canvas </strong>  — <span className="text-neutral-300"> drag and connect nodes with a click </span> </p>
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="bg-blue-400/90 p-1 rounded-lg">
                            <MdKeyboardAlt size={24}></MdKeyboardAlt>
                        </div>
                        <p className="text-lg"> <strong> Natural language input </strong> — <span className="text-neutral-300"> describe your network in plain English </span> </p>
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="bg-blue-400/90 p-1 rounded-lg">
                            <GrNetwork size={24}></GrNetwork>
                        </div>
                        <p className="text-lg"> <strong> A* pathfinding </strong>  — <span className="text-neutral-300"> get the shortest path instantly </span> </p>
                    </div>
                </div>
            </div>
            
            <LoginCard></LoginCard>
        </div>
    )
}