import {AdminPanelSettings, DarkMode, LightMode, Login, Newspaper, Search} from '@mui/icons-material'
import {AppBar, Button, IconButton, InputBase, Paper, Toolbar, Tooltip, Typography, useColorScheme} from '@mui/material'
import React, {PropsWithChildren, useRef, useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function MainLayout() {
    const navigate = useNavigate();
    let searchRef = useRef<HTMLInputElement>();
    let { mode, setMode } = useColorScheme();
    let logged = getAuth().currentUser !== null;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh", // Ensures the layout takes the full height of the viewport
            }}
        >
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <Newspaper
                            sx={{
                                color: "white",
                                fontSize: "2rem",
                            }}
                        />
                    </IconButton>
                    <Paper
                        component="form"
                        sx={{
                            marginLeft: "1rem",
                        }}
                    >
                        <InputBase
                            placeholder="Cerca"
                            sx={{
                                marginLeft: "0.5rem",
                            }}
                            inputRef={searchRef}
                            onChange={() => {
                                if (!searchRef.current) {
                                    return;
                                }
                                if (searchRef.current.value.trim().length <= 0) {
                                    navigate("/");
                                    return;
                                }
                                navigate(`/search/${searchRef.current.value}`);
                            }}
                        />
                        <IconButton type="button">
                            <Search />
                        </IconButton>
                    </Paper>
                    <Tooltip title={logged ? "Pannello di gestione" : "Accedi"}>
                        <IconButton
                            style={{
                                marginLeft: "auto",
                            }}
                            onClick={() => navigate(`/admin/dashboard/`)}
                        >
                            {logged ? (
                                <AdminPanelSettings style={{ color: "white" }} />
                            ) : (
                                <Login style={{ color: "white" }} />
                            )}
                        </IconButton>
                    </Tooltip>
                    <IconButton
                        onClick={() => {
                            if (mode === "light") {
                                setMode("dark");
                            } else {
                                setMode("light");
                            }
                        }}
                    >
                        {mode === "light" ? (
                            <DarkMode sx={{ color: "white" }} />
                        ) : (
                            <LightMode />
                        )}
                    </IconButton>
                </Toolbar>
            </AppBar>
            {/* Main Content */}
            <div
                style={{
                    flex: "1", // (it took so much to figure this out don't touch this)
                }}
            >
                <Outlet />
            </div>
            {/* Footer */}
            <footer
                style={{
                    textAlign: "center",
                    padding: "1rem"
                }}
            >
                <Typography>
                    <b>©2024 #Credici</b>
                </Typography>
                <span style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.25rem"
                }}>
                    <Typography>
                        Made with ❤️ using
                    </Typography>
                    <Tooltip title={"React TypeScript"}>
                        <img src="./react_logo.png" width={"25rem"}/>
                    </Tooltip>
                    <Typography>
                        by <b>Filippo Caminati</b>
                    </Typography>
                </span>
            </footer>
        </div>
    );
}

