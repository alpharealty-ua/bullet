import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate, useLocation } from 'react-router'

import { useGoogleAuth } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

export function GoogleLoginButton() {
  const { mutateAsync: googleAuthMutation } = useGoogleAuth()
  const navigate = useNavigate()
  const { state } = useLocation()

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      await googleAuthMutation({ code: codeResponse.code })
      const redirect = state?.redirect ?? ROUTES.root
      navigate(redirect, { state: { ...state, redirect: undefined } })
    },
    onError: (errorResponse) => {
      console.error('Google Login Error:', errorResponse)
    },
  })

  return (
    <ButtonWithAudio
      as="button"
      image="button"
      text="Google"
      onClick={() => login()}
      type="button"
      className="mt-2"
    />
  )
} 