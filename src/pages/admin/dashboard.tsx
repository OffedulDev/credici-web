import { Add, Category, Create } from '@mui/icons-material'
import { Button, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CategoryTableElement from './categoryTableElement'
import CategoryTableElementCreation, { CategoryData } from './categoryTableElementCreation'

export default function Dashboard() {
    const [categories, setCategories] = useState<CategoryData[]>([])
    const [creatingCategory, setCreatingCategory] = useState<boolean>(false)
    
    const createNewCategory = () => {
        setCreatingCategory(true)
    }
    
    return (
        <>
            {/* CATEGORIES */}
            <div className="flex" style={{
                gap: "0.25rem",
                padding: "0.5rem",
                flexDirection: "row"
            }}>
                <Category sx={{
                    fontSize: "2rem"
                }} />
                <Typography fontWeight="bold" fontSize="1.5rem">Categorie</Typography>
            </div>

            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell align="right">Sottotitolo</TableCell>
                        <TableCell align="right">Azioni</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((value, index) => {
                        return <CategoryTableElement 
                            categoryData={value} 
                            onDelete={() => {
                                //const newCategories = categories
                                categories.splice(index, 1)
                                //console.log(newCategories)
                                //setCategories(newCategories)
                            }}
                            key={index} />
                    })}
                    {creatingCategory &&
                        <CategoryTableElementCreation categories={categories} onCreated={() => {
                            setCreatingCategory(false)
                        }}/>
                    }
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Button variant='contained' startIcon={<Add />} onClick={createNewCategory} fullWidth>
                                Crea
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}
