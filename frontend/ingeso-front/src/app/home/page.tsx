'use client';

import React, { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import {useRouter} from "next/navigation";
import { useAuth } from '@/context/AuthContext';

export default function Home(){
    const {token, setToken} = useAuth();
    const router = useRouter();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const [verificador, setVerificador] = useState(true);

    useEffect(()=> {
        if(!token) {
            router.replace('/login');
        }else{
            setVerificador(false);
        }
    }, [token, router]);

    if(verificador){
        return null;
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
        
    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        router.push('/login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Bienvenido, {user?.nombre}!
          </h2>
          <p className="text-gray-600 mb-2">
            <strong>Correo:</strong> {user?.correo}
          </p>
          <p className="text-gray-600 mb-6">
            <strong>RUT:</strong> {user?.rut}
          </p>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Cerrar sesión 🤑
          </button>
        </div>
      </div>
    );
    
};

