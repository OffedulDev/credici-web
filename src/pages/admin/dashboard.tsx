import {Form, Link, RouteObject, useLoaderData, useNavigate} from "react-router-dom";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import React, {useEffect, useState} from "react";
import {
    Button, Checkbox,
    Dialog, DialogContentText, DialogTitle, FormControl, FormHelperText, FormLabel, OutlinedInput,
    Table,
    ButtonGroup,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Article, ElectricalServices, Home, Logout, ManageHistory, SpeedRounded} from "@mui/icons-material";
import TextWithIcon from "../../utils/TextWithIcon";
import {get, getDatabase, ref, update} from "firebase/database";
import {toast} from "react-toastify";
import getLoader from "./accountLoader";

function CategoryRow(props: { value: any }) {
    let [checked, setChecked] = useState<boolean>(props.value.headline)

    useEffect(() => {
        if (checked === props.value.headline) {
            return
        }

        let updates: any = {}
        let newCategoryData = props.value
        newCategoryData.headline = checked

        updates[`/categories/${props.value.name}/`] = newCategoryData
        toast.promise(
            update(
                ref(getDatabase()),
                updates
            ).catch((err: any) => toast.error(err)),
            {
                pending: "Aggiornamento...",
                success: "Aggiornato!",
                error: "Errore nell'aggiornamento"
            }
        )
    }, [checked]);

    return <TableRow>
        <TableCell>{props.value.name}</TableCell>
        <TableCell align="right">{props.value.media ? props.value.media.length : "Vuoto"}</TableCell>
        <TableCell align="right" style={{
            width: "10%"
        }}>
            <Checkbox checked={checked} onClick={() => {
                setChecked(!checked)
            }}/>
        </TableCell>
    </TableRow>;
}

function Dashboard() {
    const userData: User = useLoaderData() as User
    const navigate = useNavigate()
    const isDesktop = useMediaQuery('(min-width: 500px)')

    // Retrive categories
    let [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false)
    let [categories, setCategories] = useState<any[]>()
    useEffect(() => {
        get(ref(getDatabase(), `/categories/`)).then((snapshot) => {
            if (snapshot.exists()) {
                let dataArray: any[] = []
                snapshot.forEach((categorySnapshot) => {
                    dataArray.push(categorySnapshot.val())
                })
                setCategories(dataArray)
            }
        })
    }, []);

    return (
        <>
            <div style={{
                padding: "1rem"
            }}>
                <Typography fontSize={isDesktop ? "2rem" : "1rem"} fontWeight="bold">
                    Benvenuto, {userData.email}
                </Typography>
                <ButtonGroup variant='contained'>
                    <Button color='error' startIcon={<Logout />} onClick={() => navigate(`/auth/logout`)}>Esci</Button>
                    <Button startIcon={<Home />} onClick={() => navigate(`/`)}>Home</Button>
                </ButtonGroup>

                <div style={{
                    marginTop: "2rem"
                }}>
                    <TextWithIcon icon={<ElectricalServices />} text={"Servizi"} />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        width: "fit-content"
                    }}>
                        <Button variant='contained' startIcon={<Article />} onClick={() => {
                            navigate(`../createNewMedia`)
                        }}>
                            Crea un nuovo articolo
                        </Button>
                        <Button variant='contained' startIcon={<ManageHistory />} onClick={() => {
                            navigate(`../manageArticles`)
                        }}>
                            Gestisci gli articoli
                        </Button>
                    </div>
                </div>

                <div style={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <TextWithIcon icon={<SpeedRounded />} text={"Panoramica rapida"} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell align="right">Articoli</TableCell>
                                <TableCell align="right">Prima pagina</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories && categories.map((value, index) => {
                                return <CategoryRow key={index} value={value}/>
                            })}
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Button onClick={() => setIsCreatingCategory(true)}>
                                        Crea nuova categoria
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    {/* Create new category dialog */}
                    <Dialog
                        open={isCreatingCategory}
                        onClose={() => setIsCreatingCategory(false)}
                    >
                        <DialogTitle>Crea una nuova categoria</DialogTitle>
                        <DialogContentText paddingX="1rem">Crea una nuova categoria che potrà ospitare diversi
                            articoli. Evita nomi troppo lunghi o con caratteri speciali.</DialogContentText>
                        <Form
                            style={{
                                paddingLeft: "1rem",
                                paddingRight: "2rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.25rem"
                            }}
                            method="POST"
                            action="/admin/requests/createNewCategory"
                        >
                            <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <OutlinedInput type='text' name="name" fullWidth={true} />
                            </FormControl>
                            <FormControl style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <span>In prima pagina?</span>
                                <Checkbox name='headline' defaultChecked={true} style={{
                                    marginLeft: "auto"
                                }} />
                            </FormControl>

                            <Button type='submit' variant='contained' onClick={() => setIsCreatingCategory(false)}>
                                Invia
                            </Button>
                            <FormHelperText style={{
                                marginTop: "1rem",
                                marginBottom: "0.75rem"
                            }}>La pressione del pulsante crea una nuova categoria che sarà visibile
                            fin da subito se l'opzione "In prima pagina?" è selezionata</FormHelperText>
                        </Form>
                    </Dialog>
                </div>
            </div>
        </>
    )
}

export const dashboardRoute = {
    path: 'dashboard',
    element: <Dashboard />,
    loader: getLoader
} as RouteObject
