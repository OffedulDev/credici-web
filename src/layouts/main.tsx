import {AdminPanelSettings, DarkMode, LightMode, Login, Newspaper, Search} from '@mui/icons-material'
import {AppBar, Button, IconButton, InputBase, Paper, Toolbar, Tooltip, Typography, useColorScheme} from '@mui/material'
import React, {PropsWithChildren, useRef, useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function MainLayout() {
    const navigate = useNavigate()
    let searchRef = useRef<HTMLInputElement>()
    let { mode, setMode } = useColorScheme()
    let logged = getAuth().currentUser !== null

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={() => {
                        navigate("/")
                    }}>
                        <Newspaper sx={{
                            color: "white",
                            fontSize: "2rem"
                        }}/>
                    </IconButton>
                    <Paper component="form" sx={{
                        marginLeft: "1rem"
                    }}>
                        <InputBase 
                            placeholder='Cerca'
                            sx={{
                                marginLeft: "0.5rem"
                            }}
                            inputRef={searchRef}

                            onChange={() => {
                                if (!searchRef.current) { return }
                                if (searchRef.current.value.trim().length <= 0) { 
                                    navigate("/")
                                    return 
                                }
                                navigate(`/search/${searchRef.current.value}`)
                            }}
                        />
                        <IconButton type="button">
                            <Search />
                        </IconButton>
                    </Paper>
                    <Tooltip title={logged ? "Pannello di gestione" : "Accedi"}>
                        <IconButton style={{
                            marginLeft: "auto"
                        }} onClick={() => navigate(`/admin/dashboard/`)}>
                            {logged ? <AdminPanelSettings style={{color: 'white'}} /> : <Login style={{color: "white"}} />}
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={() => {
                        if (mode === "light") {
                            setMode("dark")
                        } else {
                            setMode("light")
                        }
                    }}>
                        {mode === "light" ? <DarkMode sx={{color: "white"}} /> : <LightMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div style={{
            }}>
                <Outlet />
            </div>
            <div style={{
                paddingTop: "4rem"
            }}/>
            <footer style={{
                position: "fixed",
                bottom: "0.35rem",
                display: "flex",
                alignItems: "center",
                left: "50%",
                transform: "translate(-50%, 0)",
                justifyContent: "center",
            }}>
                <Typography variant="caption" align='center' padding="1rem" style={{
                    textWrap: "nowrap",
                    backgroundColor: mode === "dark" ? 'rgb(18, 18, 18)' : "white",
                    color: mode === "dark" ? "white" : "black",
                    borderRadius: "2rem"
                }}><b>©2024 #Credici</b></Typography>
            </footer>
        </>
    )
} 
