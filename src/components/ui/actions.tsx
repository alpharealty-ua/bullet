import { GiCrossedBones, GiCheckMark } from 'react-icons/gi'

import { ButtonWithAudio } from './button-with-audio'

interface ActionsProps {
  onConfirm: () => void
  onCancel: () => void
}

const Actions = ({ onConfirm, onCancel }: ActionsProps) => {
  return (
    <div className='flex justify-between gap-1'>
      <ButtonWithAudio
        as='button'
        bg='white'
        className='text-green hover:bg-green hover:border-green h-4 w-4 rounded-full p-0 text-[0.6rem] transition-all hover:text-white'
        onClick={onConfirm}
      >
        <GiCheckMark />
      </ButtonWithAudio>
      <ButtonWithAudio
        as='button'
        bg='white'
        className='text-red hover:bg-red hover:border-red h-4 w-4 rounded-full p-0 text-[0.6rem] transition-all hover:text-white'
        onClick={onCancel}
      >
        <GiCrossedBones />
      </ButtonWithAudio>
    </div>
  )
}

export { Actions }
