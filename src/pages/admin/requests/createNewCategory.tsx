import { Typography } from '@mui/material'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { get, getDatabase, ref, set } from 'firebase/database'
import React from 'react'
import {redirect, RouteObject, useLoaderData, useNavigate} from 'react-router-dom'
import {toast} from "react-toastify";

function CreateNewCategory() {
    return (
        <Typography>Elaborazione in corso, attendi...</Typography>
    )
}

export const createNewCategoryRoute = {
    path: 'createNewCategory',
    element: <CreateNewCategory />,
    action: async ({params, request}) => {
        new Promise(async (resolve, reject) => {
            let formData = await request.formData()
            let name = formData.get("name")
            let headline = formData.get("headline")

            toast.promise(
                set(
                    ref(
                        getDatabase(),
                        `/categories/${name}/`,
                    ),
                    {
                        "name": name,
                        "headline": headline === 'on',
                        "media": []
                    }
                ).catch((err) => toast.error(err)),
                {
                    pending: "Aggiornamento...",
                    success: "Aggiornato!",
                    error: "Errore nell'aggiornamento."
                }
            )
        })
        throw redirect(`/admin/dashboard`)
    }
} as RouteObject