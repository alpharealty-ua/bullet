import { Logo } from '@/components/logo'
import { ForgotPasswordForm } from '@/components/forms/forgot-password.form.tsx'

const ForgotPasswordPage = () => {
  return (
    <>
      <Logo as='link' to='/' size='xl' />
      <ForgotPasswordForm />
    </>
  )
}

export { ForgotPasswordPage }
