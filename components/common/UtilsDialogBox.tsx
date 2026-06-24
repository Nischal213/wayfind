import { ChangeEvent, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { UtilsDialogBoxProps } from "@/lib/types";
import { SidebarMenuButton } from "../ui/sidebar";

export const UtilsDialogBox = (props: UtilsDialogBoxProps) => {
    const { title, description, btnName, btnColor, icon, inputName, action } = props
    const [userInput, setUserInput] = useState("")
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")

    const updateUserInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setUserInput(value)
    }

    const onConfirm = async () => {
        const error = await action(userInput)

        if (error) {
            setError(error)
        } else {
            setError("")
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton
                    tooltip={title}
                    onClick={() => {
                        setError("")
                        setOpen(true)
                        setUserInput("")
                    }}>
                    <div className={`${btnColor || ""} group-data-[state=collapsed]:absolute group-data-[state=collapsed]:left-2`}>
                        {icon}
                    </div>
                    <div className={`${btnColor || ""} group-data-[state=collapsed]:hidden`}>
                        {btnName}
                    </div>
                </SidebarMenuButton>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription asChild>
                        <p className="text-sm tracking-tighter leading-4.5 font-medium">
                            {description}
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <Label className="mb-2"> {inputName} </Label>
                        <Input name={inputName} value={userInput} onChange={updateUserInput} />
                    </Field>

                    {error ?
                        <p className='text-red-600 text-center'> {error} </p>
                        :
                        null}
                </FieldGroup>

                <DialogFooter className="flex items-center justify-end gap-3 pt-4">
                    <DialogClose asChild>
                        <button className="px-4 py-2 rounded-lg text-sm font-bold text-gray-700 bg-neutral-50 border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors">
                            Close
                        </button>
                    </DialogClose>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-[#EDEDED] bg-black hover:bg-neutral-700 transition-colors"
                    >
                        Confirm
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}