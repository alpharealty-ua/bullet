import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const Rules = () => {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='px-4 text-3xl font-bold'>Game Rules</h3>
      <Tabs
        className='flex shrink-0 grow flex-col gap-4 overflow-hidden'
        defaultValue='duel'
      >
        <TabsList>
          <TabsTrigger value='duel' className='text-base'>
            DUEL
          </TabsTrigger>
          <TabsTrigger value='solo' className='text-base'>
            Solo
          </TabsTrigger>
        </TabsList>
        <TabsContent value='duel' className='flex flex-col gap-8 px-4 text-sm'>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Game Overview</h4>
            <p>
              Duel is a timing-based PVP shooter where you face off against
              opponents in quick-fire rounds. Test your reflexes and precision
              to become the ultimate duelist!
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Game Flow</h4>
            <ol className='flex list-decimal flex-col gap-2 pl-8'>
              <li className='text-sm marker:text-2xl'>
                Character Selection: Choose your character before entering the
                matchmaking queue
              </li>
              <li className='text-sm marker:text-2xl'>
                Matchmaking: The system pairs you with an opponent of similar
                skill level and ping
              </li>
              <li className='text-sm marker:text-2xl'>
                The Duel: Face your opponent in a timing-based shooting match
              </li>
              <li className='text-sm marker:text-2xl'>
                Results: Win or lose based on your timing precision
              </li>
              <li className='text-sm marker:text-2xl'>
                Rematch Option: Option to play additional games against the same
                opponent
              </li>
            </ol>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Core Mechanics</h4>
            <ul className='flex list-disc flex-col gap-1 pl-8'>
              <li className='text-sm marker:text-2xl'>
                A timing bar displays a moving green light that travels back and
                forth
              </li>
              <li className='text-sm marker:text-2xl'>
                Time your shot to hit one of three target zones:
                <ul className='flex list-[circle] flex-col gap-2 pl-4'>
                  <li className='text-sm'>
                    100% Zone designated by a skull: Guaranteed kill
                  </li>
                  <li className='text-sm'>
                    20% Zone: 20% chance to hit your opponent
                  </li>
                  <li className='text-sm'>
                    10% Zone: 10% chance to hit your opponent
                  </li>
                </ul>
              </li>
              <li className='text-sm marker:text-2xl'>
                Each player gets one shot per round
              </li>
              <li className='text-sm marker:text-2xl'>
                If both players hit the 100% zone (the skull), the earlier shot
                (measured in milliseconds) wins
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Match Rules</h4>
            <ul className='flex list-disc flex-col gap-1 pl-8'>
              <li className='text-sm marker:text-2xl'>
                Each match consists of a single game
              </li>
              <li className='text-sm marker:text-2xl'>
                After a match, both players can opt to rematch for a series
              </li>
              <li className='text-sm marker:text-2xl'>
                You can play a maximum of 3 games against the same opponent
                consecutively
              </li>
              <li className='text-sm marker:text-2xl'>
                If the series is tied 1-1, a third game can be played as a
                tiebreaker
              </li>
              <li className='text-sm marker:text-2xl'>
                If either player achieves a 2-0 lead, no third game is played
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Ranking System</h4>
            <ul className='flex list-disc flex-col gap-1 pl-8'>
              <li className='text-sm marker:text-2xl'>
                Your performance is tracked through a LVL ranking (1-1000)
              </li>
              <li className='text-sm marker:text-2xl'>
                Higher LVL indicates greater skill
              </li>
              <li className='text-sm marker:text-2xl'>
                Matchmaking pairs players of similar LVL to ensure fair
                competition
              </li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value='solo' className='flex flex-col gap-8 px-4 text-sm'>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Game Overview</h4>
            <p>
              Bullet Solo is a high-stakes gambling game that simulates the
              infamous game of chance with a virtual revolver. Test your luck as
              you attempt to survive a series of trigger pulls to win big
              multipliers on your bet.
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Basic Rules</h4>
            <ul className='flex list-disc flex-col gap-1 pl-8'>
              <li className='text-sm marker:text-2xl'>
                Players place a bet between $100 and $10,000
              </li>
              <li className='text-sm marker:text-2xl'>
                A single bullet is randomly placed in one of 6 chambers
              </li>
              <li className='text-sm marker:text-2xl'>
                Players must survive 5 trigger pulls to win their full prize
              </li>
              <li className='text-sm marker:text-2xl'>
                Each pull increases tension as the odds of survival decrease
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>How to Play</h4>
            <ol className='flex list-decimal flex-col gap-2 pl-8'>
              <li className='text-sm marker:text-2xl'>
                Enter your bet amount ($100-$10,000)
              </li>
              <li className='text-sm marker:text-2xl'>
                Click "Place Bet" to begin
              </li>
              <li className='text-sm marker:text-2xl'>
                A multiplier is randomly assigned to your game (2x-1000x)
              </li>
              <li className='text-sm marker:text-2xl'>
                Pull the trigger by clicking the "Pull Trigger" button
              </li>
              <li className='text-sm marker:text-2xl'>
                Survive all 5 pulls to win your bet × multiplier
              </li>
              <li className='text-sm marker:text-2xl'>
                Hit the bullet at any point and you lose your entire bet
              </li>
            </ol>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Deal Offers</h4>
            <ul className='flex list-disc flex-col gap-1 pl-8'>
              <li className='text-sm marker:text-2xl'>
                After each successful pull, you may receive a "Deal" offer
              </li>
              <li className='text-sm marker:text-2xl'>
                Deals are presented when your expected value (EV) is at least
                50% of your original bet
              </li>
              <li className='text-sm marker:text-2xl'>
                The offer amount will vary based on your current odds and
                potential winnings
              </li>
              <li className='text-sm marker:text-2xl'>
                You can accept the deal to secure a guaranteed win, or reject it
                to continue playing
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Survival Odds</h4>
            <p>Your odds of survival change with each pull:</p>
            <ul className='flex list-disc flex-col gap-1 pl-8'>
              <li className='text-sm marker:text-2xl'>
                1st pull: 5/6 chance of survival (83.3%)
              </li>
              <li className='text-sm marker:text-2xl'>
                2nd pull: 4/5 chance of survival (80.0%)
              </li>
              <li className='text-sm marker:text-2xl'>
                3rd pull: 3/4 chance of survival (75.0%)
              </li>
              <li className='text-sm marker:text-2xl'>
                4th pull: 2/3 chance of survival (66.7%)
              </li>
              <li className='text-sm marker:text-2xl'>
                5th pull: 1/2 chance of survival (50.0%)
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Multipliers and Probabilities</h4>
            <p>
              Your potential winnings depend on the multiplier assigned at the
              start of your game:
            </p>
            <table className='w-full divide-y divide-gray-200 text-center text-sm'>
              <thead>
                <tr className='bg-white text-left'>
                  <th className='px-4 py-1 text-left font-normal whitespace-nowrap'>
                    Multiplier
                  </th>
                  <th className='px-4 py-1 text-left font-normal whitespace-nowrap'>
                    Probability
                  </th>
                  <th className='px-4 py-1 text-left font-normal whitespace-nowrap'>
                    Win
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['2x', '42.2', '$200'],
                  ['3x', '25.1', '$300'],
                  ['5x', '17.25', '$500'],
                  ['10x', '10.4', '$1,000'],
                  ['25x', '4.0', '$2,500'],
                  ['100x', '1.0', '$10,000'],
                  ['1000x', '0.05', '$100,000'],
                ].map(([multiplier, probability, win], i) => (
                  <tr
                    key={i}
                    className='bg-white duration-150 even:bg-gray-50 hover:bg-blue-50'
                  >
                    <td className='px-4 py-1 text-left'>{multiplier}</td>
                    <td className='px-4 py-1 text-left'>{probability}</td>
                    <td className='px-4 py-1 text-left'>{win}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold'>Fairness Verification</h4>
            <p>Every game is provably fair:</p>
            <ul className='flex list-disc flex-col gap-1 pl-8'>
              <li className='text-sm marker:text-2xl'>
                Each game generates a unique cryptographic seed
              </li>
              <li className='text-sm marker:text-2xl'>
                The bullet position is determined by this seed
              </li>
              <li className='text-sm marker:text-2xl'>
                After the game, you can verify the randomness was fair
              </li>
              <li className='text-sm marker:text-2xl'>
                The game has a near-even expected value over time
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { Rules }
