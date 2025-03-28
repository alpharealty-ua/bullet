import { ConnectionStatus } from '@/socket/matchmaker/matchmaker-soket.types'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from './ui/button-with-audio'

const connectionStatusMap: Record<ConnectionStatus, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  authenticating: 'Authenticating',
  authenticated: 'Authenticated',
  'not-authenticated': 'Not authenticated',
  'authentication-failed': 'Authentication failed',
}

export const MatchmakerConnection = ({
  connectionStatus,
  authenticated,
  onClick,
}: {
  connectionStatus: ConnectionStatus
  authenticated: boolean
  onClick: () => void
}) => {
  return (
    <div className='flex w-full items-center justify-center gap-4'>
      <div
        className={cn(
          'w-full flex-1 p-2 text-xs',
          (connectionStatus === 'authentication-failed' ||
            connectionStatus === 'not-authenticated' ||
            connectionStatus === 'disconnected') &&
            'bg-[#f8d7da] text-[#721c24]',
          (connectionStatus === 'connected' ||
            connectionStatus === 'authenticated') &&
            'bg-[#d4edda] text-[#155724]',
          connectionStatus === 'authenticating' &&
            'bg-[#fff3cd] text-[#856404]',
        )}
      >
        {connectionStatusMap[connectionStatus]}
      </div>
      <div className='flex-1'>
        <ButtonWithAudio
          as='button'
          bg={authenticated ? 'red' : 'green'}
          className={cn('w-full px-1 text-xs')}
          onClick={onClick}
          disabled={['authenticating'].includes(connectionStatus)}
        >
          {authenticated ? 'Disconnect' : 'Connect to Matchmaker'}
        </ButtonWithAudio>
      </div>
    </div>
  )
}
