import { useSettings } from '@/store/settings.store'
import { audiosEntries } from '@/lib/constants'

const Audios = () => {
  const soundEffects = useSettings(({ soundEffects }) => soundEffects)

  return (
    <div id='audios' className='absolute'>
      {audiosEntries.map(([key, src], i) => (
        <audio
          key={i}
          src={src}
          muted={soundEffects}
          data-audio={`${key}`}
        ></audio>
      ))}
    </div>
  )
}

export { Audios }
