import { Logo } from '@/components/logo'
import { PageWrapper } from '@/components/page-wrapper'
import { ForgotPasswordForm } from '@/components/forms/forgot-password.form.tsx'

const ForgotPasswordPage = () => {
  return (
    <PageWrapper>
      <Logo as='link' to='/' size='xl' />
      <ForgotPasswordForm />
    </PageWrapper>
  )
}

export { ForgotPasswordPage }
