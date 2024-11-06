import { Add, Label } from '@mui/icons-material'
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Input, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from '@mui/material'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { get, getDatabase, ref } from 'firebase/database'
import React, { useState } from 'react'
import {Form, useNavigate} from 'react-router-dom'

export default function CreateNewMedia() {
    const navigate = useNavigate()

    // Categories
    let [categories, setCategories] = useState([])
    onAuthStateChanged(getAuth(), (user) => {
        if (user === undefined) {
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

    // FORM INFO
    let [category, setCategory] = useState<string>("")
    let [kind, setKind] = useState<string>('text')
    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string)
    }

    return (
        <>
            <div style={{
                display: "flex",
                gap: "0.25rem",
                flexDirection: "column",
                paddingTop: "1rem",
                paddingLeft: "0.6rem",
                paddingRight: "0.6rem"
            }}>
                <Button onClick={() => navigate(`/admin/dashboard`)}>Torna indietro</Button>
                <Typography sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }} fontWeight="bold">
                    <Add />
                    Crea un nuovo media
                </Typography>
                <Form method='post' encType='multipart/form-data' action='/admin/requests/createNewMedia' style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem"
                }}>
                    <FormControl fullWidth>
                        <FormLabel>Titolo*</FormLabel>
                        <OutlinedInput type='text' name='title' required />
                    </FormControl>
                    <FormControl fullWidth>
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
                    <FormControl style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <span>In prima pagina?</span>
                        <Checkbox name='headline' style={{
                            marginLeft: "auto"
                        }} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Tipo di contenuto</FormLabel>
                        <RadioGroup defaultValue='text' name='content-kind' onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setKind(event.target.value)
                        }}>
                            <FormControlLabel value='text' control={<Radio />} label='Testo' />
                            <FormControlLabel value='video' control={<Radio />} label='Video' />
                            <FormControlLabel value='audio' control={<Radio />} label='Audio' />
                        </RadioGroup>
                    </FormControl>

                    {/* Kind specific options */}
                    {kind === 'text' && (
                        <FormControl>
                            <FormLabel>Testo*</FormLabel>
                            <Input type='file' name='content-text'/>
                            <FormHelperText>Il pdf verrà caricato sul cloud di Firebase, in caso non ci sia più spazio il caricamento potrebbe fallire</FormHelperText>
                        </FormControl>
                    )}
                    {kind === 'video' && (
                        <FormControl>
                            <FormLabel>Video*</FormLabel>
                            <Input type='file' name='content-video'/>
                            <FormHelperText>Il video verrà caricato sul cloud di Firebase, in caso non ci sia più spazio il caricamento potrebbe fallire</FormHelperText>
                        </FormControl>
                    )}
                    {kind === 'audio' && (
                        <Typography>
                            Audio
                        </Typography>
                    )}

                    <FormControl>
                        <FormLabel>Immagine di testata</FormLabel>
                        <Input type='file' name='header-image' />
                        <FormHelperText>Immagine mostrata nella testata</FormHelperText>
                    </FormControl>

                    <Button type='submit' variant='contained' style={{
                        marginTop: "0.25rem"
                    }}>Crea</Button>
                    <FormHelperText>Verrà creato un nuovo media e immediatamente pubblicato secondo quanto espresso in questo modulo.</FormHelperText>
                </Form>
            </div>
        </>
    )
}
