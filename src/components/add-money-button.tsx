import { useShowAddMoneyModal } from '@/hooks/use-add-money-modal'

import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const AddMoneyButton = () => {
  const showAddMoneyModal = useShowAddMoneyModal()

  const handleAddMoney = showAddMoneyModal

  return (
    <div className='relative flex flex-col items-center justify-center pt-8'>
      <ButtonWithAudio
        as='button'
        image='button'
        text='Add money'
        onClick={handleAddMoney}
      />
    </div>
  )
}

export { AddMoneyButton }
