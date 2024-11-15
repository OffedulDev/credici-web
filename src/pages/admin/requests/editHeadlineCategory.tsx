import {redirect, RouteObject} from "react-router-dom";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {getDatabase, ref, update} from "firebase/database"
import {toast} from "react-toastify";

export const editHeadlineCategoryRoute = {
    path: "/admin/requests/editHeadlineCategory/:position",
    action: async ({params, request}) => {
        let formData = await request.formData()
        let position = params.position;
        let categoryChosen = formData.get("category");

        let disconnect = onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                let updates: any = {}
                updates[`/headlineCategories/${position}`] = categoryChosen

                toast.promise(
                    update(ref(getDatabase()), updates),
                    {
                        pending: "Aggiornamento...",
                        success: "Categoria aggiornata",
                        error: "Errore nell'aggiornamento!"
                    }
                )
                disconnect()
            }
        })

        throw redirect("/admin/dashboard")
    }
} as RouteObject