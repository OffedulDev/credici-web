import {Button, Typography, useMediaQuery} from '@mui/material'
import { get, getDatabase, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MediaCard from './mediaCard'
import * as firebaseStorage from 'firebase/storage'
import {FilterList, PartyMode, Person2TwoTone, Timer} from '@mui/icons-material'

const HEADLINES_LIMIT_DAYS = 30 // Headlines older than this won't be shown

function CategoryViewer(props: { category: string, isDesktop: boolean }) {
    let [categoryArticles, setCategoryArticles] = useState<any[]>([])
    useEffect(() => {
        get(ref(getDatabase(), `/categories/${props.category}`)).then((snapshot) => {
            if (snapshot.exists()) {
                let dataArray: any[] = []
                let categoryMedia: any[] = snapshot.val().media

                categoryMedia.forEach(async (value, index) => {
                    get(ref(getDatabase(), `/media/${value}/`)).then((mediaData) => {
                        if (mediaData.exists()) {
                            dataArray.push({
                                id: value,
                                ... mediaData.val()
                            })
                        }

                        if (index === (categoryMedia.length - 1)) {
                            setCategoryArticles(dataArray)
                        }
                    })
                })

            }
        })
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25",
        }}>
            <Typography align={"center"} padding={"0.25rem"} fontWeight={"bold"}>{props.category}</Typography>
            <div style={{
                display: "flex",
                flexDirection: props.isDesktop ? "column" : "row",
                gap: "0.25rem",
            }}>
                {categoryArticles.map((value, index) => {
                    return <MediaCard key={index} isDesktop={props.isDesktop} value={value} />
                })}
            </div>
        </div>
    )
}

export default function Home() {
    const navigate = useNavigate()
    let [headlines, setHeadlines] = useState<{}[]>()

    let [category1, setCategory1] = useState<string>()
    let [category2, setCategory2] = useState<string>()
    let [category3, setCategory3] = useState<string>()
    useEffect(() => {
        get(ref(getDatabase(), `/headlineCategories/1/`)).then((snapshot) => {
            if (snapshot.exists()) {
                setCategory1(snapshot.val())
            }
        })
        get(ref(getDatabase(), `/headlineCategories/2/`)).then((snapshot) => {
            if (snapshot.exists()) {
                setCategory2(snapshot.val())
            }
        })
        get(ref(getDatabase(), `/headlineCategories/3/`)).then((snapshot) => {
            if (snapshot.exists()) {
                setCategory3(snapshot.val())
            }
        })
    }, []);

    let [categories, setCategories] = useState<any[]>([])
    const isDesktop = useMediaQuery('(min-width: 500px)');

    let [coverURL, setCoverURL] = useState<string>()
    useEffect(() => {
        firebaseStorage.getDownloadURL(
            firebaseStorage.ref(
                firebaseStorage.getStorage(),
                `cover.jpg`
            )
        ).then((download) => {
            setCoverURL(download)
        })
    }, []);

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
                backgroundImage: `url("${coverURL}")`,
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
                padding: "1.5rem",
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <Typography align={"center"} fontSize={isDesktop ? "2rem" : "1.5rem"}>In evidenza</Typography>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.25rem",
                        overflowX: "auto",
                        padding: "0.5rem",
                        justifySelf: "center",
                        justifyContent: "center"
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
                </div>

                {(category1 && category2 && category3) && (
                    <div style={{
                        display: "flex",
                        flexDirection: isDesktop ? "row" : "column",
                        gap: "0.25rem",
                        paddingTop: "1.5rem",
                        justifyContent: isDesktop ? "space-around" : "center"
                    }}>
                        <CategoryViewer category={category1} isDesktop={isDesktop}/>
                        <CategoryViewer category={category2} isDesktop={isDesktop}/>
                        <CategoryViewer category={category3} isDesktop={isDesktop}/>
                    </div>
                )}

            </div>
        </div>
    )
}
