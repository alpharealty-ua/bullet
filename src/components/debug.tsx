import { createPortal } from 'react-dom'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/api/api'
import { useAuthStore } from '@/store/auth.store'
import { getItem, removeItem } from '@/lib/localstorage'
import { Button as ButtonWithAudio } from '@/components/ui/button'

const Debug = () => {
  const queryClient = useQueryClient()
  const resetTokens = useAuthStore(({ resetTokens }) => resetTokens)

  const handleResetAddMoney = () => {
    removeItem('endTime')
  }

  const handleLogout = async () => {
    resetTokens()
    await queryClient.setQueryData([QUERY_KEYS.profile], null)
  }

  if (!getItem('showDebug')) {
    return null
  }

  return createPortal(
    <div className='absolute top-0 right-[calc(50%+var(--width)/2)] flex w-50 flex-col gap-2 bg-amber-100 p-4'>
      <ButtonWithAudio
        as='button'
        className='text-base'
        text='Logout'
        bg='primary'
        onClick={handleLogout}
      />
      <ButtonWithAudio
        as='button'
        className='text-base'
        text='Reset add money'
        bg='primary'
        onClick={handleResetAddMoney}
      />
    </div>,
    document.body,
  )
}

export { Debug }
