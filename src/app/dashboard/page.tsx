"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin")
    }
  }, [loading, user, router])

  if (loading) return <p>Loading...</p>
  if (!user) return null

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Welcome, {user.email}</h1>
      <button onClick={signOut} className="bg-red-600 text-white p-2 rounded mt-4">
        Sign out
      </button>
    </div>
  )
}
