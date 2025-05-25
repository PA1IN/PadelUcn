'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';

interface TipoAutenticacion
{
    token: string | null;
    setToken: (token: string | null) => void;
    loading: boolean;
}

const contextoAutenticacion = createContext<TipoAutenticacion | undefined>(undefined);

export const ProveedorAuth = ({children}:{children: React.ReactNode}) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokenguardado = sessionStorage.getItem('token');
        if(tokenguardado)
        {
            setToken(tokenguardado);
        }
        setLoading(false);
    }, []);


    useEffect(() => {
        if(token){
            sessionStorage.setItem('token',token);
        } else {
            sessionStorage.removeItem('token');
        }
    }, [token]);

    return (
        <contextoAutenticacion.Provider value = {{token, setToken, loading}}>
            {children}
        </contextoAutenticacion.Provider>
    );
};

export const useAuth = (): TipoAutenticacion => {
    const contexto = useContext(contextoAutenticacion);
    if(!contexto) {
        throw new Error('el hook de useAuth debe ir dentro de un ProveedorAuth');
    }
    return contexto;
};

