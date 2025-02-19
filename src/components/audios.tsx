import { audiosEntries } from '@/lib/constants'

const Audios = () => {
  return (
    <div id='audios' className='absolute'>
      {audiosEntries.map(([key, src], i) => (
        <audio key={i} src={src} data-audio={`${key}`}></audio>
      ))}
    </div>
  )
}

export { Audios }
