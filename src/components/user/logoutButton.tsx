'use client'
import { useSupabase } from '@/app/supabase-provider/provider'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      Cerrar Sesión
    </button>
  )
}
