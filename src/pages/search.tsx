import React from 'react'
import { RouteObject, useLoaderData, useNavigate } from 'react-router-dom'
import { endAt, get, getDatabase, orderByChild, query, ref, startAt } from "firebase/database"
import * as icons from "@mui/icons-material"
import { IconButton, Typography } from '@mui/material'
import MediaCard from './mediaCard'

function Search() {
    const { searchResults, query }: any = useLoaderData()

    return (
        <div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.25rem",
                padding: "1rem"
            }}>
                <icons.Search />
                <Typography fontWeight="semibold">Ricerca per "{query}" ha prodotto {searchResults.length} risultati</Typography>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "1.5rem",
                marginRight: "0.5rem",
                gap: "0.25rem"
            }}>
                {searchResults.map((value: any, index: number) => {
                    return <MediaCard isDesktop={false} key={index} value={value} index={index} />
                })}
            </div>
        </div>
    )
}

export const searchRoute = {
    path: 'search/:query',
    element: <Search />,
    loader: async ({params, request}) => {
        let searchText = params.query
        if (searchText === undefined) {
            throw new Response("Missing search query", { status: 400 })
        }
        let mediaRef = ref(getDatabase(), `/media/`)

        const compareQuery = (data: any) => {
            if (searchText?.startsWith("category:")) {
                return data.category.toLowerCase().includes(searchText?.slice(10, searchText?.length).toLowerCase())
            } else if (searchText?.startsWith("id:")) {
                return data.id === searchText?.slice(3, searchText?.length)
            } else {
                return data.title.toLowerCase().includes(searchText?.toLowerCase())
            }
        }

        let snapshot = await get(mediaRef)
        if (!snapshot.exists()) {
            return {
                searchResults: [],
                query: searchText
            }
        } else {
            var results: any[] = []
            snapshot.forEach((childSnapshot) => {
                let data = {id: childSnapshot.key, ...childSnapshot.val()}
                if (compareQuery(data)) {
                    results.push(data);
                }
            })

            results.sort((a: any, b: any) => {
                if (a.timestamp && b.timestamp) {
                    return a.timestamp < b.timestamp ? 1 : -1
                }
                return NaN
            })
            return {
                searchResults: results,
                query: searchText
            }
        }
    }

} as RouteObject