import { GetStatsResponse } from '@/api/leadboard.api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const RegionalDistribution = ({
  regions,
}: {
  regions: GetStatsResponse['regions']
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {regions.map((region) => (
            <div key={region.name} className='space-y-1'>
              <div className='flex justify-between'>
                <span>{region.name}</span>
                <span>
                  {region.count} players ({region.percentage}%)
                </span>
              </div>
              <div className='h-2 w-full rounded-full bg-gray-200'>
                <div
                  className='h-2 rounded-full bg-blue-600'
                  style={{ width: `${region.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className='mt-6'>
          <h4 className='mb-2 font-bold'>Population Insights:</h4>
          <ul className='space-y-1 text-sm'>
            <li>• 45% of players are between LVL 41-60</li>
            <li>• Only 1% of players reach LVL 91+</li>
            <li>• Average LVL across all players: 52</li>
            <li>• North America has the highest average LVL: 54</li>
            <li>• Players typically reach LVL 65+ after 350+ games</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export { RegionalDistribution }
