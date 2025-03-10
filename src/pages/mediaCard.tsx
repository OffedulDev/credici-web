import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import * as firebaseStorage from "firebase/storage"
import { useNavigate } from "react-router-dom"

export default function MediaCard({isDesktop, index, value}: any) {
    const navigate = useNavigate()
    let [headerImg, setHeaderImg] = useState<string>()

    useEffect(() => {
        firebaseStorage.getDownloadURL(
            firebaseStorage.ref(
                firebaseStorage.getStorage(), 
                `/headers/${value.id}`
            )
        ).then((downloadURL) => {
            setHeaderImg(downloadURL)
        }).catch((err) => console.log(err))
    }, [])

    return <Card style={{
        minWidth: isDesktop ? "25vw" : "75vw",
        maxWidth: isDesktop ? "25vw" : "75vw",
        maxHeight: "20rem",
        display: "flex",
        flexDirection: "column"
    }} key={index}>
        {headerImg && (
            <CardMedia
                component="img"
                sx={{
                    height: "10vh"
                }}
                image={headerImg}
            />
        )}
        <CardHeader title={value.title} subheader={value.category} />
        <CardContent>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {value.desc}
            </Typography>
        </CardContent>
        <CardActions style={{
            marginTop: "auto"
        }}>
            <Button size="small" onClick={() => {
                navigate(`/view/${value.id}`)
            } }>
                Visualizza
            </Button>
        </CardActions>
    </Card>
}