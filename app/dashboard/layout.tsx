import { redirect } from 'next/navigation'
import { getSessionUserId } from '@/lib/auth-session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSessionUserId()
  if (!userId) redirect('/login')
  return <>{children}</>
}
