import { Logo } from '@/components/logo'
import { ResetPasswordForm } from '@/components/forms/reset-password.form.tsx'

const ResetPasswordPage = () => {
  return (
    <>
      <Logo as='link' to='/' size='xl' />
      <ResetPasswordForm />
    </>
  )
}

export { ResetPasswordPage }
