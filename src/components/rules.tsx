const Rules = () => {
  return (
    <div className='flex flex-col gap-8 text-sm'>
      <h3 className='text-3xl font-bold'>DUEL: Game Rules</h3>
      <div className='flex flex-col gap-4'>
        <h4 className='font-bold'>Game Overview</h4>
        <p>
          Duel is a timing-based PVP shooter where you face off against
          opponents in quick-fire rounds. Test your reflexes and precision to
          become the ultimate duelist!
        </p>
      </div>
      <div className='flex flex-col gap-4'>
        <h4 className='font-bold'>Game Flow</h4>
        <ol className='flex list-decimal flex-col gap-2 pl-8'>
          <li className='text-sm marker:text-2xl'>
            Character Selection: Choose your character before entering the
            matchmaking queue
          </li>
          <li className='text-sm marker:text-2xl'>
            Matchmaking: The system pairs you with an opponent of similar skill
            level and ping
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
      <div className='flex flex-col gap-4'>
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
      <div className='flex flex-col gap-4'>
        <h4 className='font-bold'>Match Rules</h4>
        <ul className='flex list-disc flex-col gap-2 pl-8'>
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
      <div className='flex flex-col gap-4'>
        <h4 className='font-bold'>Ranking System</h4>
        <ul className='flex list-disc flex-col gap-2 pl-8'>
          <li className='text-sm marker:text-2xl'>
            Your performance is tracked through a LVL ranking (1-1000)
          </li>
          <li className='text-sm marker:text-2xl'>
            Higher LVL indicates greater skill
          </li>
          <li className='text-sm marker:text-2xl'>
            Matchmaking pairs players of similar LVL to ensure fair competition
          </li>
        </ul>
      </div>
    </div>
  )
}

export { Rules }
