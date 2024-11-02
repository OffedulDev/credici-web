import { Save } from '@mui/icons-material'
import { Button, Input, TableCell, TableRow } from '@mui/material'
import React, { useRef } from 'react'
import { toast } from 'react-toastify'

type CategoryData = {
    name: string;
    subtitle: string
}

interface CategoryTableElementCreationProps {
    categories: CategoryData[];
    onCreated: (() => void) | null; 
}

export type {
    CategoryData
}

export default function CategoryTableElementCreation({ categories, onCreated }: CategoryTableElementCreationProps) {
    const nameRef = useRef<HTMLInputElement>()
    const subtitleRef = useRef<HTMLInputElement>()

    const saveCategory = () => {
        if (nameRef === undefined || subtitleRef === undefined) { return }
        if (nameRef.current === undefined || subtitleRef.current === undefined) { return }
        if (nameRef.current.value === undefined || subtitleRef.current.value === undefined) { return }
        if (nameRef.current.value.trim().length === 0 || subtitleRef.current.value.trim().length === 0) { 
            toast.error("Dai un nome alla tua categoria!")
            return 
        }

        const categoryData: CategoryData = {
            "name": nameRef.current.value,
            "subtitle": subtitleRef.current.value
        }
        categories.push(categoryData)

        if (onCreated) {
            onCreated()
            nameRef.current.value = ""
            subtitleRef.current.value = ""
        }
    }

    return (
        <TableRow>
            <TableCell>
                <Input inputRef={nameRef} placeholder='nome' />
            </TableCell>
            <TableCell>
                <Input inputRef={subtitleRef} placeholder='sottotitolo' />
            </TableCell>
            <TableCell>
                <Button variant='outlined' onClick={saveCategory} fullWidth startIcon={<Save />}>
                    Salva
                </Button>
            </TableCell>
        </TableRow>
    )
}