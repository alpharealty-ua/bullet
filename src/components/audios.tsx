import { audiosEntries, audios } from '@/lib/constants'

// TODO: EXTRACT TO UTILS
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

  audio
    .play()
    .then(() => {
      console.log('Play audio - ' + audio.src)
    })
    .catch(console.log)
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
