import { audiosEntries, audios } from '../utils/constants'

export const playAudio = (key: keyof typeof audios) => {
  const audios = document.getElementById('audios')

  if (audios === null) {
    return
  }

  const selector = `.audio-${key}`

  const audio = audios.querySelector(selector) as HTMLAudioElement

  if (audio === null) {
    return
  }

  audio.play()
}

const Audios = () => {
  return (
    <div id='audios'>
      {audiosEntries.map(([key, src], i) => (
        <audio key={i} src={src} className={`audio-${key}`}></audio>
      ))}
    </div>
  )
}

export { Audios }
