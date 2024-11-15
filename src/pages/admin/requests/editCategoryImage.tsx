import {redirect, RouteObject} from "react-router-dom";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {get, getDatabase, ref, set} from "firebase/database";
import * as firebaseStorage from "firebase/storage"
import {toast} from "react-toastify";

export const editCategoryImageRoute = {
    path: "/admin/requests/editCategoryImage/:category",
    action: async ({params, request}) => {
        let formData = await request.formData()
        let category = params.category

        let disconnect = onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                get(ref(getDatabase(), `/categories/${category}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newValue = snapshot.val();
                        let image = formData.get("image") as File

                        toast.promise(
                            firebaseStorage.uploadBytes(
                                firebaseStorage.ref(firebaseStorage.getStorage(), `/categoryImages/${category}`),
                                image
                            ).then(() => {
                                newValue["image"] = `/categoryImages/${category}`
                                toast.promise(
                                    set(ref(getDatabase(), `/categories/${category}`), newValue),
                                    {
                                        pending: "Aggioramento categoria...",
                                        success: "Categoria aggiornata",
                                        error: "Errore nell'aggiornamento della categoria."
                                    }
                                )
                            }),
                            {
                                pending: "Caricamento immagine",
                                success: "Immagine caricata",
                                error: "Errore nel caricamento dell'immagine"
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