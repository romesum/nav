import Auth from '@/components/Auth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    // 检查用户是否已登录
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/') // 如果已登录，重定向到首页
      }
    }
    checkUser()
  }, [router])

  return <Auth />
} 