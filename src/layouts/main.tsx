import { Newspaper, Search } from '@mui/icons-material'
import { AppBar, IconButton, InputBase, Paper, Toolbar, Typography, useColorScheme } from '@mui/material'
import React, { PropsWithChildren, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function MainLayout() {
    const navigate = useNavigate()
    let searchRef = useRef<HTMLInputElement>()
    let { mode, setMode } = useColorScheme()

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
                }}>Sito realizzato per il giornalino scolastico <b>© 2024 Credici</b></Typography>
            </footer>
        </>
    )
} 
