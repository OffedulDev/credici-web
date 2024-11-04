import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function MediaCard({isDesktop, index, value}: any) {
    const navigate = useNavigate()
    return <Card variant='outlined' style={{
        maxWidth: isDesktop ? "25vw" : "75vw"
    }} key={index}>
        <CardHeader title={value.title} subheader={value.category} />
        <CardContent>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Questo è un esempio di slogano della notizia, qui si può scrivere un corto testo di descrizione!
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <Button onClick={() => {
                navigate(`/view/${value.id}`)
            } }>
                Visualizza
            </Button>
        </CardActions>
    </Card>
}