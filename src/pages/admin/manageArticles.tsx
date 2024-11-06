import {RouteObject, useLoaderData, useNavigate} from "react-router-dom";
import getLoader from "./accountLoader";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    Tooltip,
    DialogActions,
    Dialog, DialogTitle, Button, DialogContentText
} from "@mui/material";
import {useEffect, useState} from "react";
import {get, getDatabase, ref, remove} from "firebase/database";
import {CopyAll, Delete, SearchRounded, TextFormat, Videocam} from "@mui/icons-material";
import * as firebaseStorage from "firebase/storage";
import {toast} from "react-toastify";

function ArticleRow({value, index}: any) {
    const navigate = useNavigate()
    const returnOnceFinished = (promises: Promise<any>[]) => {
        return new Promise((resolve, reject) => {
            let finishedPromises = 0
            promises.forEach((promise) => promise.finally(() => {
                finishedPromises++

                if (finishedPromises == promises.length - 1) {
                    setTimeout(() => {
                        resolve(0)
                    }, 1500)
                }
            }))
        })
    }
    const deleteArticle = () => {
        let file = value.file
        let promises = []
        if (file) {
            let fileDeletionPromise = firebaseStorage.deleteObject(
                firebaseStorage.ref(
                    firebaseStorage.getStorage(),
                    file
                )
            ).catch((err) => toast.error(err))

            promises.push(fileDeletionPromise)
            toast.promise(
                fileDeletionPromise,
                {
                    pending: "Eliminazione del file associato...",
                    success: "File associato eliminato!",
                    error: "Errore nell'eliminazione del file associato."
                }
            )
        }

        let elementDeletionPromise = remove(
            ref(
                getDatabase(),
                `/media/${value.id}`
            )
        ).catch((err) => toast.error(err))
        promises.push(elementDeletionPromise)

        toast.promise(
            elementDeletionPromise,
            {
                pending: "Eliminazione dell'articolo...",
                success: "Articolo eliminato!",
                error: "Errore nell'eliminazione dell'articolo"
            }
        )

        returnOnceFinished(promises).then(() => {
            window.location.reload()
        })
    }

    let [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return <TableRow>
        <TableCell>{value.title}</TableCell>
        <TableCell>{value.category}</TableCell>
        <TableCell>{value.contentKind === "text" ? <TextFormat /> : <Videocam />}</TableCell>
        <TableCell align="right">
            <Tooltip title="Copia ID">
                <IconButton onClick={() => {
                    navigator.clipboard.writeText(value.id)
                }}>
                    <CopyAll />
                </IconButton>
            </Tooltip>
            <Tooltip title="Cerca">
                <IconButton onClick={() => {
                    navigate(`/search/id:${value.id}`)
                }}>
                    <SearchRounded />
                </IconButton>
            </Tooltip>
            <Tooltip title="Cancella">
                <IconButton onClick={() => setDeleteDialogOpen(true)}>
                    <Delete color='error' />
                </IconButton>
            </Tooltip>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Sei sicuro di voler cancellare questo articolo? (irreversibile)</DialogTitle>
                <DialogContentText style={{
                    paddingLeft: "1.5rem",
                    paddingRight: "1.5rem"
                }}>ID: {value.id}</DialogContentText>
                <DialogActions>
                    <Button color='error' startIcon={<Delete />} onClick={() => deleteArticle()}>
                        Cancella
                    </Button>
                    <Button  onClick={() => setDeleteDialogOpen(false)}>
                        Annulla
                    </Button>
                </DialogActions>
            </Dialog>
        </TableCell>
    </TableRow>
}

function ManageArticles() {
    //const userData = useLoaderData()
    const isDesktop = useMediaQuery('(min-width: 500px)')
    let [articles, setArticles] = useState<any[]>()

    // Load articles
    useEffect(() => {
        get(
            ref(getDatabase(), `/media/`),
        ).then((snapshot) => {
            if (snapshot.exists()) {
                let dataArray: any[] = []
                snapshot.forEach((mediaSnapshot) => {
                    dataArray.push({id: mediaSnapshot.key, ...mediaSnapshot.val()})
                })
                setArticles(dataArray)
            }
        })
    }, []);

    return (
        <>
            <div style={{
                padding: "1rem",
            }}>
                <Typography fontSize={isDesktop ? "2rem" : "1rem"} fontWeight="bold">
                    Gestisci gli articoli
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Categoria</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell align="right">Azioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articles && articles.map((value, index) => {
                            return <ArticleRow value={value} index={index} key={index} />
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export const manageArticlesRoute = {
    path: 'manageArticles',
    element: <ManageArticles />,
    loader: getLoader()
} as RouteObject