import { Button, Card, CardActions, CardContent, CardHeader, Typography, useMediaQuery } from '@mui/material'
import { child, get, getDatabase, onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MediaCard from './mediaCard'
import { FilterList } from '@mui/icons-material'
import { resolve } from 'path'

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

                var data: any[] = []
                categoriesSnapshot.forEach((categorySnapshot) => {
                    data.push(categorySnapshot.val())
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
            return new Promise(async (resolve, reject) => {
                const headlinesSnapshot = await get(ref(getDatabase(), `/headline/`))
                if (headlinesSnapshot.exists()) {
                    var tempHeadlinesIds: string[] = []
                    headlinesSnapshot.forEach((childSnapshot) => {
                        let headlineValue = childSnapshot.val()
                        let differenceDays = (((Date.now() - headlineValue)/1000)/86400)
                        if (differenceDays < HEADLINES_LIMIT_DAYS) {
                            tempHeadlinesIds.push(childSnapshot.key)
                        } else {
                            console.log("Headline is older than limit.")
                        }
                    })

                    var tempHeadlines: {}[] = []
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
            paddingRight: "1.5rem",
            paddingLeft: "1.5rem",
            display: "flex",
            flexDirection: "column"  
        }}>
            <h2>Prima pagina</h2>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.25rem",
                overflowX: "scroll",
                padding: "0.5rem",
                justifySelf: "center"
            }}>
                {headlines && headlines.map((value: any, index: number) => {
                    //return <Typography key={index}>{JSON.stringify(value)}</Typography>
                    return <MediaCard isDesktop={isDesktop} value={value} index={index} key={index} />
                })}
            </div>

            <h2><FilterList /> Per categoria</h2>
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
    )
}
