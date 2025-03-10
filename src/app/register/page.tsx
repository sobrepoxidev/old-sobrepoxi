'use client'

import React, { useState, useEffect } from 'react'
import { useSupabase } from '@/app/supabase-provider/provider'
import { FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip' // Ejemplo: npm install react-tooltip (o quítalo si no lo quieres)

export default function RegisterPage() {
  const { supabase } = useSupabase()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [confirmationMsg, setConfirmationMsg] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (password !== confirmPass) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }
    if (!acceptTerms) {
      setErrorMsg('Debes aceptar los términos para continuar.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone} },
      })
      if (error) {
        setErrorMsg(error.message)
      } else {
        setConfirmationMsg('Registro exitoso. Revisa tu correo y confirma tu cuenta antes de iniciar sesión.')
      }
    } catch {
      setErrorMsg('Error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-14">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700 relative">

        {/* Título */}
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Crea tu Cuenta
        </h1>

        {/* Mensajes de confirmación o error */}
        {confirmationMsg && (
          <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 p-3 rounded-md mb-4 text-sm transition">
            {confirmationMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-md mb-4 text-sm transition">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Nombre
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-correo@ejemplo.com"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Teléfono
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 dark:text-gray-500" />
              <input
                type="tel"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Tu número de teléfono"
                required
              />
            </div>
          </div>

          

          {/* Contraseña */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Contraseña
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Checkbox Aceptar Términos */}
          <div className="flex items-center gap-2 pt-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="w-4 h-4 accent-primary dark:accent-primary hover:cursor-pointer"
            />
            <label htmlFor="terms" className="text-gray-700 dark:text-gray-300 text-sm hover:cursor-pointer">
              Acepto los Términos y Condiciones
            </label>
          </div>

          {/* Botón de Envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              data-tooltip-id="submitTooltip"
              data-tooltip-content={
                !acceptTerms ? 'Debes aceptar los términos' : ''
              }
              className={`w-full btn-primary text-lg font-bold ${
                loading || !acceptTerms
                  ? 'opacity-60 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              {loading ? 'Procesando...' : 'Crear Cuenta'}
            </button>
            {/* Tooltip con react-tooltip (opcional) */}
            <Tooltip id="submitTooltip" place="bottom" />
          </div>
        </form>

      </div>
    </div>
  )
}
