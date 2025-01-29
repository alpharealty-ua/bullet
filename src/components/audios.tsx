import { audiosEntries } from '@/lib/constants'

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
