import {Button, CircularProgress, Typography, useMediaQuery} from '@mui/material'
import { get, getDatabase, ref } from 'firebase/database'
import * as firebaseStorage from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { RouteObject, useLoaderData, useNavigate } from 'react-router-dom'
import PdfRenderer from "../utils/pdfRenderer";
import {ArticleRounded, Category, PermIdentity} from "@mui/icons-material";

// Render the different post kinds
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

// Headers
function DesktopHeader(props: { imageURL: string | undefined, postData: any, id: any }) {
    let [hovered, setHovered] = useState<boolean>(false)

    return <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
    }}>
        <img
            style={{
                borderRadius: "1rem",
                width: "35%"
            }}
            src={props.imageURL ? props.imageURL : "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        />

        <div style={{
            marginLeft: "1rem"
        }}>
            <Typography fontSize="2rem" fontWeight="bold">{props.postData.title}</Typography>
            <Typography variant="caption">{props.postData.desc}</Typography>

            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Category/>
                <Typography fontWeight="semibold">Categoria: {props.postData.category}</Typography>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <PermIdentity />
                <Typography fontWeight="semibold"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >ID: {hovered ? props.id : "metti il mouse"}</Typography>
            </div>
        </div>
    </div>;
}

function MobileHeader(props: { imageURL: string | undefined, postData: any }) {
    return <div style={{
        display: "flex",
        width: "100%",
        flexDirection: "column"
    }}>
        <img
            style={{
                height: "20vh",
                width: "100%"
            }}
            src={props.imageURL ? `${props.imageURL}` : `https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
        />
        <div style={{
            marginTop: "0.5rem",
            display: "flex",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            flexDirection: "column",
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.5rem"
            }}>
                <ArticleRounded/>
                <Typography style={{textWrap: "pretty"}} fontSize="1.5rem"
                            fontWeight="bold">{props.postData.title}</Typography>
            </div>
            <Typography style={{
                justifySelf: "end",
                textWrap: "pretty"
            }} align="right" variant="caption">{props.postData.desc}</Typography>
        </div>
    </div>;
}

// Main component
function ViewPost() {
    const navigate = useNavigate()
    let [imageURL, setImageURL] = useState<string>()
    const { postData, id }: any = useLoaderData()
    const isDesktop = useMediaQuery('(min-width: 500px)');

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


    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{
                padding: isDesktop ? "1rem" : 0,
                marginBottom: "1.25rem"
            }}>
                {isDesktop ? <DesktopHeader imageURL={imageURL} postData={postData} id={id}/> : <MobileHeader imageURL={imageURL} postData={postData}/>}
            </div>

            {/* Render the content */}
            <PostInformations postData={postData} />
        </div>
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
