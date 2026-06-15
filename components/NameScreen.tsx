'use client'
import { useEffect, useRef, useState } from 'react'

interface NameScreenProps {
  onConfirm: (name: string) => void
}

export default function NameScreen({ onConfirm }: NameScreenProps) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (name.trim().length >= 2) onConfirm(name.trim())
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0B1A' }}>
      <div className="w-full" style={{ height: 96, background: '#26215C' }} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-medium text-white">Before your day begins —</h2>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              What&apos;s your first name?
            </p>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Your name"
            className="bg-transparent text-white text-2xl font-medium py-2 outline-none w-full transition-colors duration-150"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={name.trim().length < 2}
            className="w-full py-4 font-medium text-sm tracking-wide text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: '#7F77DD', borderRadius: 99 }}
          >
            Start my day
          </button>
        </div>
      </div>
    </div>
  )
}
