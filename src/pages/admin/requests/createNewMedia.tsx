import { Typography } from "@mui/material"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { get, getDatabase, ref, set, update } from "firebase/database"
import * as firebaseStorage from "firebase/storage"
import { redirect, RouteObject, useLoaderData } from "react-router-dom"
import { toast } from "react-toastify"
const { v4: uuidv4 } = require('uuid')

export const createNewMediaRequestRoute = {
    path: 'createNewMedia',
    element: <Typography>Richiesta in elaborazione, verrete rendirizzati al completamento</Typography>,
    action: async ({params, request}) => {
      let formData = await request.formData()
      
      let title = formData.get("title")
      let category = formData.get("category")
      let isHeadline = formData.get("headline")
      let desc = formData.get("desc")
      let contentKind = formData.get("content-kind")

      let headerImage: File = formData.get("header-image") as File
      const id = uuidv4()
      
      const doRestrictedActions = () =>  {
        return new Promise((resolve, reject) => {
          onAuthStateChanged(getAuth(), async (user) => {
            if (user === null) {
              return
            }
    
            let snapshot = await get(ref(getDatabase(), `/categories/${category}`))
            if (snapshot.exists()) {
              const categoryData = snapshot.val()
              if (categoryData.media === undefined) {
                categoryData.media = []
              }
    
              categoryData.media.push(id)
    
              const updates: any = {}
              if (isHeadline == 'on') {
                // Add media to headline if setting is on
                updates[`/headline/${id}`] = Date.now()
              }
    
              updates[`/media/${id}`] = {
                "title": title,
                "category": category,
                "isHeadline": isHeadline,
                "contentKind": contentKind,
                "desc": desc,
                "images": {
                  "header": (headerImage.name.trim().length > 0) ? `/headers/${id}` : false
                } 
              }
              updates[`/categories/${category}`] = {
                "name": categoryData.name,
                "media": categoryData.media
              }
    
              if (contentKind === "video") {
                let video: File = formData.get("content-video") as File
                //if (/\.mp4$/.test(video.name)) 
                let uploadPromise = firebaseStorage.uploadBytes(
                  firebaseStorage.ref(firebaseStorage.getStorage(), `/videos/${id}`),
                  video
                )
    
                updates[`/media/${id}`]["file"] = `/videos/${id}`
    
                toast.promise(
                  uploadPromise,
                  {
                    pending: "Video in caricamento...",
                    success: "Video caricato",
                    error: "Errore nel caricamento del video."
                  }
                )
                await uploadPromise
              } else if(contentKind === "text") {
                let pdf: File = formData.get("content-text") as File
                let uploadPromise = firebaseStorage.uploadBytes(
                  firebaseStorage.ref(firebaseStorage.getStorage(), `/texts/${id}`),
                  pdf
                )

                updates[`/media/${id}`]["file"] = `/texts/${id}`

                toast.promise(
                  uploadPromise,
                  {
                    pending: "Documento in caricamento...",
                    success: "Documento caricato",
                    error: "Errore nel caricamento del documento."
                  }
                )
                await uploadPromise
              }
    
              if (headerImage.name.trim().length > 0) {
                toast.promise(
                  firebaseStorage.uploadBytes(firebaseStorage.ref(firebaseStorage.getStorage(), `/headers/${id}`), 
                  headerImage),
                  {
                    pending: "Caricamento dell'immagine sul cloud...",
                    success: "Immagine caricata",
                    error: "Errore nel caricamento dell'immagine"
                  }
                )
              }
    
              await update(ref(getDatabase()), updates)
              console.log("updated the thingy v2")
    
              toast.success("Richiesta elaborata con successo!")
              resolve("")
            } 
          })
        })
      }

      await doRestrictedActions()
      throw redirect("/admin/dashboard")
    }
} as RouteObject