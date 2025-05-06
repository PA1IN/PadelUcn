'use client';

import React, { useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import {useRouter} from "next/navigation";
import { useAuth } from '@/context/AuthContext';

export default function Home(){
    const {token, setToken} = useAuth();
    const router = useRouter();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    

    useEffect(()=> {
        if(!token) {
            router.push('/login');
        }
    }, [token, router]);

    if(!token){
        return null;
    }
    
    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        router.push('/login');
    }


    if(cargauser)
    {
        return <div> Cargando... </div>;
    }
    
    if(isError)
    {
        setToken(null);
        router.push('/login');
        return null;
    }

    return (
    <div> 
        <h2> Bienvenido: {user?.nombre}, tu correo es: {user?.correo}, tu rut es: {user?.rut} </h2>
        <button onClick={logout}>Cerrar la sesion 🤑</button>
    </div>
    );
    
};

