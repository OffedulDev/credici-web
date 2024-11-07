import { Button, CircularProgress, Typography } from '@mui/material'
import { get, getDatabase, ref } from 'firebase/database'
import * as firebaseStorage from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { RouteObject, useLoaderData, useNavigate } from 'react-router-dom'
import PdfRenderer from "../utils/pdfRenderer";

function TextPost({postData, id}: any) {
    let [textURL, setTextURL] = useState<string>()
    useEffect(() => {
        firebaseStorage.getDownloadURL(
            firebaseStorage.ref(firebaseStorage.getStorage(), postData.file)
        ).then((downloadURL) => {
            setTextURL(downloadURL)
        })
    }, [])

    return (
        <>
            {textURL ? <PdfRenderer url={textURL} /> : <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
            }}>
                <CircularProgress />
                <Typography>Caricamento del documento...</Typography>
            </div>}
        </>
    )
}

function VideoPost({postData, id}: any) {
    let [videoURL, setVideoURL] = useState<string>()
    useEffect(() => {
        firebaseStorage.getDownloadURL(
            firebaseStorage.ref(firebaseStorage.getStorage(), postData.file)
        ).then((downloadURL) => {
            setVideoURL(downloadURL)
        })
    }, [])

    return (
        <>
            {videoURL ? <div>
                <video 
                    style={{
                        width: "100%"
                    }}
                    src={videoURL}
                    controls
                    controlsList='nodownload'
                    autoPlay
                />
            </div> : <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
            }}>
                <CircularProgress />
                <Typography>Caricamento del video...</Typography>
            </div>}
        </>
    )
}

function PostInformations({ postData, id }: any) {
    return (
        <>
            {postData.contentKind === "video" && <VideoPost postData={postData} id={id} />}
            {postData.contentKind === "text" && <TextPost postData={postData} id={id} />}
        </>
    )
}

function ViewPost() {
    const navigate = useNavigate()
    const { postData, id }: any = useLoaderData()
    let [imageURL, setImageURL] = useState<string>()

    useEffect(() => {
        // Get image
        if (!postData.images.header) {
            console.log("No header image.")
            return
        } 

        firebaseStorage.getDownloadURL(
            firebaseStorage.ref(firebaseStorage.getStorage(), `/headers/${id}`)
        ).then((downloadURL) => {
            setImageURL(downloadURL)
        })
    }, [])

    let textColor = imageURL ? 'white' : 'textPrimary'
    return (
        <>
            <div style={{
                backgroundImage: `url(${imageURL})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}>
                <div style={{
                    padding: "4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                    <Typography align="center" fontSize="2.5rem" fontWeight="bold" color={textColor}>{postData.title}</Typography>
                    <Typography variant='caption' color={textColor} marginBottom="1.5rem">{postData.desc}</Typography>
                </div>
            </div>
            <PostInformations postData={postData} id={id} />
        </>
    )
}

export const viewPostRoute = {
    path: 'view/:id',
    element: <ViewPost />,
    loader: async ({params, request}) => {
        if (!params.id) {
            throw new Response("ID not found!", { status: 404 })
        }

        let reference = ref(getDatabase(), `/media/${params.id}`)
        let dataSnapshot = await get(reference)
        if (!dataSnapshot.exists()) {
            throw new Response("ID exists but it's empty!", { status: 400 })
        }

        let value = dataSnapshot.val()
        let id = params.id
        return { 
            postData: value, 
            id: id }
    }
} as RouteObject
