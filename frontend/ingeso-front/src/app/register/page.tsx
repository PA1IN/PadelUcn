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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="flex mb-6 border-b border-gray-200">
          <a href="/login" className="w-1/2 text-sm font-medium py-2 text-center text-gray-400 hover:text-black">
            Iniciar sesión
          </a>
          <span className="w-1/2 text-sm font-semibold py-2 text-center border-b-2 border-black text-black cursor-default">
            Crear cuenta
          </span>
        </div>


        <h1 className="text-2xl font-bold mb-4 text-center text-black">Registro</h1>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              name="username"
              placeholder="Ingrese su nombre de usuario..."
              required
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700">RUT:</label>
            <input
              type="text"
              name="rut"
              placeholder="Ingrese un rut por favor..."
              
              required
              value={rut}
              onChange={e => setRut(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico:</label>
            <input
              type="email"
              name="email"
              placeholder="Ingrese un correo electrónico..."
              required
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña:</label>
            <input
              type="password"
              name="password"
              placeholder="Ingrese una contraseña..."
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={register.isPending}
            className={`w-full py-2 rounded-md text-white transition ${
              register.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-900'
            }`}
          >
            {register.isPending ? 'Registrando... 🗿' : 'Registrarse'}
          </button>
        </form>

        
        {errorMsg && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
