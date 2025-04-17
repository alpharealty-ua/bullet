import { useEffect, useRef } from 'react'

import { useSettingsStore } from '@/store/settings.store'
import { getAudio } from '@/lib/utils'

const useBulletSound = () => {
  const music = useSettingsStore(({ music }) => music)
  const audioElRef = useRef(getAudio('bulletTrack'))
  useEffect(() => {
    audioElRef.current.muted = !music
  }, [music])

  useEffect(() => {
    const soundEl = audioElRef.current
    soundEl.loop = true

    // Skip autoplay policy
    soundEl.play().catch(() => 0)
    soundEl.controls = true
  }, [])

  useEffect(() => {
    const play = () => audioElRef.current.play()

    document.addEventListener('click', play, { once: true })

    return () => document.removeEventListener('click', play)
  }, [])
}

export { useBulletSound }
