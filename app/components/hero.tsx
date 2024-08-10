import React from 'react'

export default function Hero({ title, subtitle, imageOn = false }: { title: string, subtitle: string, imageOn: boolean }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {imageOn && <figure>[画像]</figure>}
    </div>
  )
}
