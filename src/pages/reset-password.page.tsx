import { Logo } from '@/components/logo'
import { PageWrapper } from '@/components/page-wrapper'
import { ResetPasswordForm } from '@/components/forms/reset-password.form.tsx'

const ResetPasswordPage = () => {
  return (
    <PageWrapper>
      <Logo as='link' to='/' size='xl' />
      <ResetPasswordForm />
    </PageWrapper>
  )
}

export { ResetPasswordPage }
