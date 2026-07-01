"use client"

import { ChangeEvent, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { ToolsDialogBoxProps, ToolsDialogBoxField } from "@/lib/types"
import { showToast } from "@/lib/utils"


export const ToolsDialogBox = (props: ToolsDialogBoxProps) => {
    const { title, description, btnName, btnColor = "text-neutral-700", icon, inputsToCreate, action } = props
    const [field, setField] = useState<ToolsDialogBoxField>({ Node1: "", Node2: "", Cost: "" })
    const [open, setOpen] = useState(false)

    const updateField = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setField((prevField) => ({ ...prevField, [name]: value }))
    }

    const onConfirm = async () => {
        const { msg, type } = await action(field)

        if (type !== "success") {
            showToast(msg, type)
        } else {
            showToast(msg, type)
            setOpen(false)
            setField({ Node1: "", Node2: "", Cost: "" })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    onClick={() => {
                        setOpen(true)
                        setField({ Node1: "", Node2: "", Cost: "" })
                    }}
                    className={`${btnColor} flex w-[90%] gap-x-2 ml-4 mt-4 px-3 py-2 rounded-lg hover:bg-neutral-300 text-[13px] tracking-wide font-medium cursor-pointer`}
                >
                    {icon}
                    {btnName}
                </button>
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
                        {inputsToCreate.map((input, key) => (
                            <div key={key}>
                                <Label className="mb-2"> {input.length === 5 ? input.slice(0, 4) + " " + input.slice(4) : input} </Label>
                                <Input name={input} value={field[input]} onChange={updateField} />
                            </div>
                        ))}
                    </Field>
                </FieldGroup>

                <DialogFooter className="flex items-center justify-end gap-3 pt-4">
                    <DialogClose asChild>
                        <button className="cursor-pointer px-4 py-2 rounded-lg text-sm font-bold text-gray-700 bg-neutral-50 border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors">
                            Close
                        </button>
                    </DialogClose>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer px-4 py-2 rounded-lg text-sm font-bold text-[#EDEDED] bg-black hover:bg-neutral-700 transition-colors"
                    >
                        Confirm
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}