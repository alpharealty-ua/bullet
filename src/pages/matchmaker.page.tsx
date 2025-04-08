import { useBalance } from '@/api/wallet.api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Matchmaker } from '@/components/matchmaker'

const MatchmakerPage = () => {
  const { data: balance } = useBalance()
  const noMoney = !(balance > 0)

  return (
    <>
      <Header logoText='duel' noMoney={noMoney} headerProfile />
      <div className='flex grow flex-col items-center justify-center'>
        <Matchmaker />
      </div>
      <Footer />
    </>
  )
}

export { MatchmakerPage }
