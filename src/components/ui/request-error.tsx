import { ZodError } from 'zod'

import { Notification } from '@/components/ui/notification'

interface RequestErrorProps {
  error: Error | null
}

const RequestError = ({ error }: RequestErrorProps) => {
  if (!(error instanceof ZodError)) {
    return (
      <Notification type='error' message={error?.message ?? 'Failed to load'} />
    )
  }

  return (
    <div className='flex grow'>
      <div className='custom-scroll w-full'>
        <table className='w-full divide-y divide-gray-200 text-center text-[0.5rem]'>
          <thead>
            <tr className='bg-gray-50 text-gray-500'>
              <th className='px-2 py-3 text-left whitespace-nowrap'>Code</th>
              <th className='px-2 py-3 text-left whitespace-nowrap'>Message</th>
              <th className='px-2 py-3 text-left whitespace-nowrap'>Path</th>
              <th className='px-2 py-3 text-left whitespace-nowrap'>
                Expected
              </th>
              <th className='px-2 py-3 text-left whitespace-nowrap'>
                Received
              </th>
            </tr>
          </thead>
          <tbody>
            {error.errors.map((error) => {
              return (
                <tr className='bg-white duration-150 even:bg-gray-50 hover:bg-blue-50'>
                  <td className='px-2 py-3 text-left'>{error.code}</td>
                  <td className='px-2 py-3 text-left'>{error.message}</td>
                  <td className='px-2 py-3 text-left'>
                    {error.path.join('.')}
                  </td>
                  <td className='px-2 py-3 text-left'>
                    {error.code === 'invalid_type' && error.expected}
                  </td>
                  <td className='px-2 py-3 text-left'>
                    {error.code === 'invalid_type' && error.received}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { RequestError }
