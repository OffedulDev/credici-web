import { Newspaper, Search } from '@mui/icons-material'
import { AppBar, IconButton, InputBase, Paper, Toolbar, Typography } from '@mui/material'
import React, { PropsWithChildren } from 'react'

export default function MainLayout({ children }: PropsWithChildren) {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Newspaper sx={{
                        fontSize: "2rem"
                    }}/>
                    <Paper component="form" sx={{
                        marginLeft: "1rem"
                    }}>
                        <InputBase 
                            placeholder='Cerca'
                            sx={{
                                marginLeft: "0.5rem"
                            }}
                        />
                        <IconButton type="button">
                            <Search />
                        </IconButton>
                    </Paper>
                </Toolbar>
            </AppBar>
            <div style={{
                maxWidth: "100vw",
                overflow: "scroll"
            }}>
                {children}
            </div>
            <footer style={{
                position: "absolute",
                bottom: "0.35rem",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant="caption" align='center'>Sito realizzato per il giornalino scolastico <b>© 2024 Credici</b></Typography>
            </footer>
        </>
    )
} 
