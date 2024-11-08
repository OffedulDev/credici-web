import {redirect, RouteObject} from "react-router-dom";
import {getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from "firebase/auth"
import {toast} from "react-toastify";
const { v4: uuidv4 } = require('uuid')

export const newAdminRequestRoute = {
    path: "newAdmin",
    action: async ({params, request})=> {
        let formData = await request.formData()
        let email = formData.get("email")

        if (email !== null) {
            let creationPromise = createUserWithEmailAndPassword(
                getAuth(),
                email.toString(),
                `TEMP-PASSWORD_${uuidv4()}`
            ).catch((err) => toast.error(err))

            toast.promise(
                creationPromise,
                {
                    pending: "Creazione account...",
                    success: "Account creato!",
                    error: "Errore nella creazione."
                }
            )

            creationPromise.then(() => {
                signOut(getAuth()).then(() => {
                    toast.info("Invio email a breve, NON CHIUDERE LA PAGINA")

                    setTimeout(() => {
                        if (!email) { return }
                        let emailPromise= sendPasswordResetEmail(
                            getAuth(),
                            email.toString()
                        ).catch((err) => toast.error(err))

                        toast.promise(
                            emailPromise,
                            {
                                pending: "Email in invio...",
                                success: "Email inviata!",
                                error: "Errore nell'invio."
                            }
                        )
                    }, 1500)
                })
            })
        }

        throw redirect("/admin/dashboard")
    }
} as RouteObject