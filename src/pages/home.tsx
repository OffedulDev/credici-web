import {Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography, useMediaQuery} from '@mui/material'
import { get, getDatabase, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MediaCard from './mediaCard'
import * as firebaseStorage from 'firebase/storage'
import {FilterList, PartyMode, Person2TwoTone, Timer} from '@mui/icons-material'

function isCloserToToday(timestamp1: number, timestamp2: number) {
    const now = Math.floor(Date.now() / 1000);

    const diff1 = Math.abs(now - timestamp1);
    const diff2 = Math.abs(now - timestamp2);

    return diff1 < diff2
}

function CategoryViewer(props: { category: string, isDesktop: boolean}) {
    const navigate = useNavigate();
    let [categoryData, setCategoryData] = useState<any>()
    let [imageURL, setImageURL] = useState<string>()


    useEffect(() => {
        get(
            ref(getDatabase(), `/categories/${props.category}`)
        ).then((snapshot) => {
            if (snapshot.exists()) {
                setCategoryData(snapshot.val())

                if (snapshot.val().image) {
                    firebaseStorage.getDownloadURL(firebaseStorage.ref(firebaseStorage.getStorage(), snapshot.val().image)).then((downloadURL) => {
                        setImageURL(downloadURL)
                    })
                }
            }
        })
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25",
        }}>
            <div style={{
                display: "flex",
                flexDirection: props.isDesktop ? "column" : "row",
                gap: "0.25rem",
            }}>
                <Card style={{
                    minWidth: props.isDesktop ? "25vw" : "75vw",
                    maxWidth: props.isDesktop ? "25vw" : "75vw",
                    maxHeight: "20rem",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {imageURL && (
                        <CardMedia
                            component="img"
                            sx={{
                                height: "30%"
                            }}
                            image={imageURL}
                        />
                    )}
                    <CardHeader title={props.category} subheader={categoryData ? (categoryData.description ? categoryData.description : "Nessuna descrizione") : "Caricamento..."} />
                    <CardActions style={{
                        marginTop: "auto"
                    }}>
                        <Button size="small" onClick={() => {
                            navigate(`/search/category:${props.category}`)
                        } }>
                            Visualizza
                        </Button>
                    </CardActions>
                </Card>
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

    // Get headlines from Firebase
    useEffect(() => {
        const updateHeadlines: () => Promise<any[]> = () => {
            return new Promise(async (resolve) => {
                const headlinesSnapshot = await get(ref(getDatabase(), `/headline/`))
                if (headlinesSnapshot.exists()) {
                    let mostRecent: any = null;
                    let mostRecentDate = 0

                    headlinesSnapshot.forEach((childSnapshot) => {
                        if (isCloserToToday(mostRecentDate, childSnapshot.val())) {
                            mostRecentDate = childSnapshot.val();
                            mostRecent = childSnapshot.key
                        }
                    })

                    get(
                        ref(getDatabase(), `/media/${mostRecent}/`)
                    ).then((snapshot) => {
                        if (snapshot.exists()) {
                            setHeadlines([{
                                id: mostRecent,
                                ...snapshot.val()
                                }])
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

                <div style={{
                    display: "flex",
                    flexDirection: isDesktop ? "row" : "column",
                    gap: "0.25rem",
                    paddingTop: "1.5rem",
                    justifyContent: isDesktop ? "space-around" : "center"
                }}>
                    {category1 && <CategoryViewer category={category1} isDesktop={isDesktop}/>}
                    {category2 && <CategoryViewer category={category2} isDesktop={isDesktop}/>}
                    {category3 && <CategoryViewer category={category3} isDesktop={isDesktop}/>}
                </div>
            </div>
        </div>
    )
}
