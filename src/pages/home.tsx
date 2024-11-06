import {Button, Typography, useMediaQuery} from '@mui/material'
import { get, getDatabase, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MediaCard from './mediaCard'
import {FilterList, PartyMode, Person2TwoTone, Timer} from '@mui/icons-material'

const HEADLINES_LIMIT_DAYS = 30 // Headlines older than this won't be shown

export default function Home() {
    let [headlines, setHeadlines] = useState<{}[]>()
    let [categories, setCategories] = useState<any[]>([])
    const navigate = useNavigate()
    const isDesktop = useMediaQuery('(min-width: 500px)');

    // Get categories from Firebase
    useEffect(() => {
        const getCategories: () => Promise<any[]> = () => {
            return new Promise(async (resolve, reject) => {
                let categoriesSnapshot = await get(ref(getDatabase(), `/categories/`))
                if (!categoriesSnapshot.exists()) {
                    reject("There aren't any categories to load!")
                    return
                }

                const data: any[] = [];
                categoriesSnapshot.forEach((categorySnapshot) => {
                    let value = categorySnapshot.val()
                    if (value.headline === true) {
                        data.push(categorySnapshot.val())
                    }
                })

                resolve(data)
            })
        } 

        getCategories().then((data) => {
            setCategories(data)
        })
    }, [])

    // Get headlines from Firebase
    useEffect(() => {
        const updateHeadlines: () => Promise<any[]> = () => {
            return new Promise(async (resolve) => {
                const headlinesSnapshot = await get(ref(getDatabase(), `/headline/`))
                if (headlinesSnapshot.exists()) {
                    const tempHeadlinesIds: string[] = [];
                    headlinesSnapshot.forEach((childSnapshot) => {
                        let headlineValue = childSnapshot.val()
                        let differenceDays = (((Date.now() - headlineValue)/1000)/86400)
                        if (differenceDays < HEADLINES_LIMIT_DAYS) {
                            tempHeadlinesIds.push(childSnapshot.key)
                        } else {
                            console.log("Headline is older than limit.")
                        }
                    })

                    const tempHeadlines: {}[] = [];
                    // noinspection ES6MissingAwait
                    tempHeadlinesIds.forEach(async (value, index) => {
                        let mediaSnapshot = await get(ref(getDatabase(), `/media/${value}/`))
                        if (mediaSnapshot.exists()) {
                            tempHeadlines.push({
                                id: value,
                                ...mediaSnapshot.val()
                            })
                        }


                        if (index === (tempHeadlinesIds.length - 1)) {
                            resolve(tempHeadlines)
                        }
                    })
                } else  {
                    console.log("Dati non disponibili")
                }
            })
        }

        updateHeadlines().then((tempHeadlines) => {
            console.log(tempHeadlines)
            setHeadlines(tempHeadlines)
        })
    }, [])

    return (
        <div style={{
            display: "flex",
            flexDirection: "column"  
        }}>
            <div style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/p/AF1QipM8n6XtaH1kQvuiges1j-vHv3_hd6AaRSQt3bKr=s680-w680-h510")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography fontSize="3rem" fontWeight="bold" padding="3rem" style={{
                    color: "white"
                }}>#Credici</Typography>
            </div>

            <div style={{
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem"
            }}>
                <h2>Prima pagina</h2>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.25rem",
                    overflowX: "auto",
                    padding: "0.5rem",
                    justifySelf: "center",
                }}>
                    {headlines && headlines.length > 0 ? headlines.map((value: any, index: number) => {
                        //return <Typography key={index}>{JSON.stringify(value)}</Typography>
                        return <MediaCard isDesktop={isDesktop} value={value} index={index} key={index}/>
                    }) : <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}>
                        <Timer/>
                        <Typography>Non c'è nulla qui per ora!</Typography>
                    </div>}
                </div>

                <h2><FilterList/> Per categoria</h2>
                <div style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "0.25rem"
                }}>
                    {categories.map((value, index) => {
                        return <Button key={index} variant='contained' onClick={() => {
                            navigate(`/search/category:${value.name}`)
                        }}>
                            {value.name}
                        </Button>
                    })}
                </div>
            </div>
        </div>
    )
}
