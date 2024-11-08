import {Form, RouteObject} from "react-router-dom";
import getLoader from "./accountLoader";
import {Button, FormControl, FormHelperText, FormLabel, OutlinedInput} from "@mui/material";

function NewAdmin() {
    return (<div style={{
        padding: "1rem",
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    }}>
        <Form method="post" action="/admin/requests/newAdmin" style={{
            display: "flex",
            flexDirection: 'column',
            gap: "0.25rem"
        }}>
            <FormControl>
                <FormLabel>Email*</FormLabel>
                <OutlinedInput type='email' name='email' placeholder='esempio@esempio.com' />
            </FormControl>
            <Button type='submit' variant='contained'>Invia</Button>

            <FormHelperText>Premendo l'account che verrà creato avrà gli stessi permessi di tutti gli altri account, quindi potrà creare, gestire e postare articoli e categorie.</FormHelperText>
        </Form>
    </div>)
}

export const newAdminRoute = {
    path: "newAdmin",
    element: <NewAdmin />,
    loader: getLoader
} as RouteObject