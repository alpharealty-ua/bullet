import { useAppContext } from '@/context/use-app-context'
import { audiosEntries } from '@/lib/constants'

const Audios = () => {
  const { settings } = useAppContext()

  return (
    <div id='audios' className='absolute'>
      {audiosEntries.map(([key, src], i) => (
        <audio
          key={i}
          src={src}
          muted={settings.soundEffects}
          data-audio={`${key}`}
        ></audio>
      ))}
    </div>
  )
}

export { Audios }
