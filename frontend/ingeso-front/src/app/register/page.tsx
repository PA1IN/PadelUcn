'use client';

import React,{SyntheticEvent, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/useRegister';

export default function Register() { //Hooks
  const [nombre, setNombre] = useState('');
  const [rut,setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [password,setPassword] = useState('');
  const [errorMsg,setErrorMsg] = useState('');
  const router = useRouter();

  const register = useRegister(() => {
    router.push('/login');
    },
    (error) => {
      setErrorMsg(error);
    }
  );

  const enviar = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg('');
    register.mutate({rut,password,correo, nombre});
  };

  return (
    <div>
        <h1>Registro</h1>
        <form onSubmit={enviar}>
            <label>Nombre: </label>
            <input type = "username" name = "username" placeholder = 'Ingrese su nombre de usuario...' required value={nombre}
              onChange={e => setNombre(e.target.value)}
            />

            <label>RUT: </label>
            <input type = "text" name = "rut" placeholder = 'Ingrese un rut porfavor...' required value={rut}
              onChange={e => setRut(e.target.value)}

            />

            <label>Correo Electronico: </label>
            <input type = "email" name = "email" placeholder = 'Ingrese un correo electronico porfavor...' required value={correo}
              onChange={e => setCorreo(e.target.value)}

            />
            <label>Contraseña: </label>
            <input type = "password" name = "password" placeholder = 'Ingrese una contraseña...' required value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" disabled = {register.isPending}>
              {register.isPending? 'Registrando...🗿' : 'Registrarse'}
            </button>
        </form>
        {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
}
