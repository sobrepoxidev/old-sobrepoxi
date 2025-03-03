'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/app/supabase-provider/provider'
import { useEffect } from 'react'


export default function LoginPage() {
  const router = useRouter()
  const { supabase } = useSupabase()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true) // Asegura que el componente se ha montado
  }, [])


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const {error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setErrorMsg(error.message)
      } else {
        // llevar  a la página de inicio
        router.push('/')
      }
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }


  if (!mounted) return null // Evita el error de hidratación

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-white dark:text-black">Iniciar Sesión</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-white dark:text-black">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-white dark:text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu-correo@ejemplo.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-white dark:bg-white dark:text-black ">Contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-white dark:text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white dark:text-black">
          ¿No tienes cuenta?
          <a href="/register" className="text-blue-600 ml-1 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  )
}
