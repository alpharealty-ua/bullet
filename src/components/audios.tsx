import { audiosValues } from '@/lib/constants'

const Audios = () => {
  return (
    <div>
      {audiosValues.map((src, i) => (
        <audio key={i} src={src}></audio>
      ))}
    </div>
  )
}

export { Audios }
