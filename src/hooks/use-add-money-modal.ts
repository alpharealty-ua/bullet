import React from 'react'

import { useCustomModal } from '@/hooks/use-custom-modal'
import { AddMoney } from '@/components/add-money'

const useShowAddMoneyModal = () => {
  const modal = useCustomModal()

  const handleAddMoney = async () => {
    modal.show({
      contentSlot: React.createElement(AddMoney, { className: 'px-4' }),
    })
  }
  return handleAddMoney
}

export { useShowAddMoneyModal }
