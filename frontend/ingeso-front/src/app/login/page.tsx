'use client';

import React,{SyntheticEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from '@/hooks/useLogin';

export default function Login() {
  const [rut, setRut] = useState(''); 
  /*const [correo,setCorreo] = useState('');*/
  const [password,setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {setToken} = useAuth();
  const router = useRouter();

  const login = useLogin((token) => {
    setToken(token);
    router.push('/home');
  },
  (error)=>{
    setErrorMsg(error);
  }

);

  const submit = (e: SyntheticEvent) => 
  {
    e.preventDefault();
    setErrorMsg('');
    login.mutate({rut,password});
      
  };


  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={submit}>
            <label>Rut: </label>
            <input type="text" name="rut" id = "rut" required value = {rut}
              onChange = {e => setRut(e.target.value)}
                   placeholder = "Ingrese porfavor su rut registrado.."
            />
            <label>Contraseña: </label>
            <input type="password" name="password" required value = {password}
              onChange = {e => setPassword(e.target.value)}
                   placeholder = "Ingrese porfavor su contraseña"
            />
            <button type="submit" value="Submit" disabled={login.isPending}>
              {login.isPending? 'iniciando sesion...🗣️🗣️': 'Login'}
            </button>
        </form>
        {login.isError && <p>usuario o contraseña incorrectas </p>}
        {errorMsg && <p>{errorMsg}</p>}
        <p>Si no tienes cuenta, registrate <a href="/register">aquí</a></p>
        <p>¿Olvidaste tu contraseña? <a href="/ForgotPassword">Recupera tu contraseña</a></p>
        
    </div>
  );
}


//export default Login;
