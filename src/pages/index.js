import Image from 'next/image'
import { Inter } from 'next/font/google'
import App from '@/components/App'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <App/>
  )
}
