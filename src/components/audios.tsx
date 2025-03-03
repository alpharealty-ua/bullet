import { useSettingsStore } from '@/store/settings.store'
import { audiosEntries } from '@/lib/constants'

const Audios = () => {
  const soundEffects = useSettingsStore(({ soundEffects }) => soundEffects)

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
