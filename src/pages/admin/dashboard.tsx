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
    Select,
    useMediaQuery, MenuItem, SelectChangeEvent, Input
} from "@mui/material";
import {
    AddLink,
    Article,
    Colorize,
    ElectricalServices,
    Home,
    Logout,
    ManageHistory,
    SpeedRounded
} from "@mui/icons-material";
import TextWithIcon from "../../utils/TextWithIcon";
import {get, getDatabase, ref, update} from "firebase/database";
import {toast} from "react-toastify";
import getLoader from "./accountLoader";

function CategoryRow(props: { value: any }) {
    let [isDialogOpen, setDialogOpen] = useState<boolean>(false)

    return <TableRow>
        <TableCell>{props.value.name}</TableCell>
        <TableCell align="right">{props.value.media ? props.value.media.length : "Vuoto"}</TableCell>
        <TableCell align="right">
            <Button variant={"contained"} onClick={() => {
                setDialogOpen(true)
            }}>
                Modifica
            </Button>
        </TableCell>

        <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Modifica categoria</DialogTitle>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                padding: "1rem"
            }}>
                <Form method="post" action={`/admin/requests/editCategoryDescription/${props.value.name}`} style={{
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <FormControl>
                        <FormLabel>Descrizione*</FormLabel>
                        <OutlinedInput type='text' name='description' required />
                    </FormControl>
                    <Button type={"submit"}>Conferma</Button>
                </Form>

                <Form method="post" action={`/admin/requests/editCategoryImage/${props.value.name}`} encType="multipart/form-data" style={{
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <FormControl>
                        <FormLabel>Immagine*</FormLabel>
                        <Input type='file' name='image' required />
                    </FormControl>
                    <Button type={"submit"}>Conferma</Button>
                </Form>
            </div>
        </Dialog>
    </TableRow>;
}

function HeadlineEditorDialog(props: { for: number }) {
    let [isDialogOpen, setDialogOpen] = useState(false);
    let [category, setCategory] = useState<string>("")

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string)
    }

    let [categories, setCategories] = useState([])
    onAuthStateChanged(getAuth(), (user) => {
        if (user === null) {
            return
        }

        get(ref(getDatabase(), "/categories/")).then((snapshot) => {
            if (snapshot.exists()) {
                const tempCategories: any = []
                snapshot.forEach((childSnapshot) => {
                    tempCategories.push(childSnapshot.val())
                })

                setCategories(tempCategories)
            }
        })
    })

    return (
        <React.Fragment>
            <Button variant={"contained"} onClick={() => {
                setDialogOpen(true);
            }}>Modifica {props.for}° sezione</Button>
            <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Modifica la categoria in copertina n. {props.for}</DialogTitle>
                <Form method="post" action={`/admin/requests/editHeadlineCategory/${props.for}`}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "1rem",
                        gap: "0.5rem"
                    }}>
                        <FormControl>
                            <FormLabel>Categoria*</FormLabel>
                            <Select
                                name='category'
                                value={category}
                                required
                                onChange={handleCategoryChange}
                            >
                                {categories.map((value: any, index: number) => {
                                    return <MenuItem value={value.name} key={index}>{value.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <Button type={"submit"} variant={"contained"} onClick={() => setDialogOpen(false)}>Conferma</Button>
                    </div>
                </Form>
            </Dialog>
        </React.Fragment>
    )
}

function HeadlineEditor() {
    return <div style={{
        marginTop: "2rem",
        display: "flex",
        flexDirection: "column"
    }}>
        <TextWithIcon icon={<Colorize/>} text="Categorie in prima pagina"/>

        {/* Edit dialog */}
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.25rem"
        }}>
            <HeadlineEditorDialog for={1} />
            <HeadlineEditorDialog for={2} />
            <HeadlineEditorDialog for={3} />
        </div>
    </div>;
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
                    <Button color='error' startIcon={<Logout/>} onClick={() => navigate(`/auth/logout`)}>Esci</Button>
                    <Button startIcon={<Home/>} onClick={() => navigate(`/`)}>Home</Button>
                </ButtonGroup>

                <div style={{
                    marginTop: "2rem"
                }}>
                    <TextWithIcon icon={<ElectricalServices/>} text={"Servizi"}/>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        width: "fit-content"
                    }}>
                        <Button variant='contained' startIcon={<Article/>} onClick={() => {
                            navigate(`../createNewMedia`)
                        }}>
                            Crea un nuovo articolo
                        </Button>
                        <Button variant='contained' startIcon={<ManageHistory/>} onClick={() => {
                            navigate(`../manageArticles`)
                        }}>
                            Gestisci gli articoli
                        </Button>
                        <Button variant='contained' startIcon={<AddLink/>} onClick={() => {
                            navigate(`../newAdmin`)
                        }}>
                            Aggiungi un admin
                        </Button>
                    </div>
                </div>

                <div style={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <TextWithIcon icon={<SpeedRounded/>} text={"Panoramica rapida"}/>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell align="right">Articoli</TableCell>
                                <TableCell align="right">Azioni</TableCell>
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
                                <OutlinedInput type='text' name="name" fullWidth={true}/>
                            </FormControl>

                            <Button type='submit' variant='contained' onClick={() => setIsCreatingCategory(false)}>
                                Invia
                            </Button>
                            <FormHelperText style={{
                                marginTop: "1rem",
                                marginBottom: "0.75rem"
                            }}>La pressione del pulsante crea una nuova categoria che sarà visibile
                                fin da subito.</FormHelperText>
                        </Form>
                    </Dialog>
                </div>
                <HeadlineEditor/>
            </div>
        </>
    )
}

export const dashboardRoute = {
    path: 'dashboard',
    element: <Dashboard />,
    loader: getLoader()
} as RouteObject
