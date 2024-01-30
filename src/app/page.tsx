"use client";
import dynamic from 'next/dynamic'

const HomeNoSSR = dynamic(() => import('./pages/home'), {
  ssr: false
})

export default function Home(): JSX.Element {
  return <HomeNoSSR />
}
