import { Typography } from '@mui/material'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { get, getDatabase, ref, set } from 'firebase/database'
import React from 'react'
import { RouteObject, useLoaderData, useNavigate } from 'react-router-dom'

function CreateNewCategory() {
    const data: any = useLoaderData()
    const navigate = useNavigate()
    onAuthStateChanged(getAuth(), (user) => {
        if (user === undefined) {
            return
        }

        const database = getDatabase()
        let name = data.name
        let reference = ref(database, `/categories/${name}`)
        set(reference, {
            "name": name,
            "media": []
        })
    })
    return (
        <Typography>Loading...</Typography>
    )
}

export const createNewCategoryRoute = {
    path: 'createNewCategory/:name',
    element: <CreateNewCategory />,
    loader: ({params, request}) => {
        return {
        name: params.name ? params.name : "noName"
        }
    }
} as RouteObject