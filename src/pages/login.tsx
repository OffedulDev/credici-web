import { Email, Password } from '@mui/icons-material';
import { Button, FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material'
import { FirebaseError } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import React, { useRef } from 'react'
import { toast } from 'react-toastify';

export default function Login() {
    const emailReference = useRef<HTMLInputElement>()
    const passwordReference = useRef<HTMLInputElement>()
    const handleLogin = () => {
        const emailInputElement = emailReference.current
        const passwordInputElement = passwordReference.current
        
        if (emailInputElement === undefined || passwordInputElement === undefined) { 
            return toast.error("Riprova tra poco, la pagina sta caricando...") 
        }
        if (
            (emailInputElement && emailInputElement.value === "") ||
            (passwordInputElement && passwordInputElement.value === "")
        ) {
            return toast.error("Inserisci le tue credenziali")
        }

        const email: string = emailInputElement.value
        const password: string = passwordInputElement.value
        const loginPromise: Promise<UserCredential> = signInWithEmailAndPassword(
            getAuth(),
            email,
            password
        )

        loginPromise.catch((error: FirebaseError) => {
            toast.error(error.message)
        })

        toast.promise(
            loginPromise,
            {
                pending: "Accesso in corso...",
                success: "Accesso eseguito!",
                error: "Errore nell'accesso"
            }
        )    
    }

    return (
        <div className="flex flex-centered flex-col">
            <Typography marginTop="0.5rem" marginBottom="0.25rem" fontSize="2rem" fontWeight="bold">Accesso</Typography>

            <form style={{
                paddingRight: "1rem",
                paddingLeft: "1rem"
            }}>
                <FormControl fullWidth variant='filled' style={{
                    marginBottom: "0.25rem"
                }}>
                    {/* EMAIL */}
                    <InputLabel htmlFor="email">
                        Email
                    </InputLabel>
                    <OutlinedInput 
                        type='email'
                        id='email'
                        inputRef={emailReference}
                        startAdornment={
                            <InputAdornment position="start">
                                <Email />
                            </InputAdornment>
                        }
                        placeholder='esempio@esempio.com'
                    />
                </FormControl>
                <FormControl fullWidth variant='filled'>
                    {/* PASSWORD */}
                    <InputLabel htmlFor="password">
                        Password
                    </InputLabel>
                    <OutlinedInput 
                        type='password'
                        id='password'
                        inputRef={passwordReference}
                        startAdornment={
                            <InputAdornment position="start">
                                <Password />
                            </InputAdornment>
                        }
                        placeholder='segreto'
                    />
                </FormControl>
                <Button fullWidth variant='contained' style={{
                    marginTop: "0.35rem"
                }} onClick={() => handleLogin()}>
                    Login
                </Button>
                <FormHelperText>Questa area è riservata solamente al personale autorizzato della redazione del giornalino <span style={{color: "blue"}}>Credici</span></FormHelperText>
            </form>
        </div>
    );
}
