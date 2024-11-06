import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import React, {useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function SecurePageWrapper() {
    const navigate = useNavigate()

    onAuthStateChanged(
        getAuth(), 
        (user) => {
            if (!user) {
                return navigate("/auth/login")
            }
        }
    )

    return (
        <>
            <Outlet />
        </>
    )
}
