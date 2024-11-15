import {redirect, RouteObject} from "react-router-dom";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {get, getDatabase, ref, set} from "firebase/database";
import {toast} from "react-toastify";

export const editCategoryDescriptionRoute = {
    path: "/admin/requests/editCategoryDescription/:category",
    action: async ({params, request}) => {
        let formData = await request.formData()
        let category = params.category

        let disconnect = onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                get(ref(getDatabase(), `/categories/${category}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newValue = snapshot.val();
                        newValue["description"] = formData.get("description")

                        toast.promise(
                            set(ref(getDatabase(), `/categories/${category}`), newValue),
                            {
                                pending: "Aggioramento categoria...",
                                success: "Categoria aggiornata",
                                error: "Errore nell'aggiornamento della categoria."
                            }
                        )
                    }
                })
                disconnect()
            }
        })

        throw redirect("/admin/dashboard")
    }
} as RouteObject