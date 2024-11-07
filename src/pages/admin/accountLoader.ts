import {getAuth, onAuthStateChanged} from "firebase/auth";
import {redirect} from "react-router-dom";

export default function getLoader() {
    return async ({params, request}: any) => {
        const waitForAccount = () => {
            return new Promise((resolve, reject) => {
                onAuthStateChanged(
                    getAuth(),
                    (user) => {
                        if (user !== undefined && user !== null) {
                            resolve(user)
                        } else {
                            reject("logged out")
                        }
                    }
                )
            })
        }

        try {
            return await waitForAccount()
        } catch {
            throw redirect(`/auth/login`)
        }
    };
}