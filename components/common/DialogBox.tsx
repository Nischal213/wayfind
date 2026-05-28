"use client"

import { ChangeEvent, ReactNode, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

export interface DialogBoxField {
    Node1 : string
    Node2 : string
    Distance : string
}

type input = "Node1" | "Node2" | "Distance"

export interface DialogBoxProps {
    title : string
    description? : boolean
    btnName : string
    icon : ReactNode
    inputsToCreate : input[]
    action : (field : DialogBoxField) => string | null
}

export const DialogBox = (props : DialogBoxProps) => {
    const { title , description=false , btnName , icon , inputsToCreate , action } = props
    const [field , setField] = useState<DialogBoxField>({Node1 : "" , Node2 : "" , Distance : ""})
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")

    const updateField = (e : ChangeEvent<HTMLInputElement>) => {
        const { name , value } = e.target

        setField((prevField) => ({...prevField , [name] : value}))
    }

    const onConfirm = () => {
        const error = action(field)
       
        if (error) {
            setError(error)
        } else {
            setError("")
            setOpen(false)
            setField({Node1 : "" , Node2 : "", Distance : ""})
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild> 
                <button
                onClick={() => {
                    setError("")
                    setOpen(true) 
                    setField({Node1 : "" , Node2 : "", Distance : ""})
                }}
                className="flex items-center gap-2 mx-4 mt-4 px-3 py-2 rounded-lg hover:bg-neutral-300 text-sm text-neutral-700"
                >
                {icon}
                {btnName}
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    { description? 
                    <DialogDescription asChild>
                        <p className="text-sm tracking-tighter leading-4.5 font-medium">
                            To delete multiple items quickly, hold Shift and drag a selection box around them, then press Backspace!
                        </p>
                    </DialogDescription> 
                    : ""}
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        {inputsToCreate.map((input , key) => (
                            <div key={key}>
                                <Label className="mb-2"> {input} </Label>
                                <Input name={input} value={field[input]} onChange={updateField}/>
                            </div>
                        ))}
                    </Field>

                    {error?
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