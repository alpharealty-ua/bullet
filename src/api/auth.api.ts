import { LoginSchema } from '@/lib/schemas/login.schema'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'

interface ILoginResponse {
  accessToken: string
  user: User
}

type User = {
  id: string
  email: string
  name: string
  status: 'ACTIVE'
  username: string
}

const login = async (values: LoginSchema) => {
  const { accessToken } = (await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  }).then((response) => response.json())) as ILoginResponse

  localStorage.setItem('accessToken', accessToken)
}

interface IProfileResponse {
  accessToken: string
  user: User
}

const fetchProfile = async () => {
  const accessToken = localStorage.getItem('accessToken')

  return fetch('/api/auth/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json()) as Promise<IProfileResponse>
}

export const useLogin = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })
