import { Checkbox, IconButton, TableCell, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CategoryData } from './categoryTableElementCreation'
import { Delete } from '@mui/icons-material'

interface CategoryTableElementProps {
    categoryData: CategoryData;
    onDelete: () => void;
}

export default function CategoryTableElement({ categoryData, onDelete }: CategoryTableElementProps) {
    return (
        <TableRow>
            <TableCell>{categoryData.name}</TableCell>
            <TableCell align="right">{categoryData.subtitle}</TableCell>
            <TableCell align="right">
                <IconButton onClick={onDelete} color='error'>
                    <Delete />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
