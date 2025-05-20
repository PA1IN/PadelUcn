import {useQuery} from '@tanstack/react-query';
import api from '../api/axios';

interface Userperfil
{
    rut: string; 
    nombre: string;
    correo: string;
}


interface Perfilresponse
{
    statusCode: number;
    message: string;
    data: Userperfil
    success: boolean;

}

export function useUserProfile(){
    return useQuery<Userperfil>({
        queryKey:['user'],
        queryFn: async () => {
            const respuesta = await api.get<Perfilresponse>('/api/auth/profile');
            console.log("datos de respuesta del perfil pa visualizar: ", respuesta.data);
            return respuesta.data?.data;
        },
    });
}