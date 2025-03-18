import { LoginForm } from '@/components/forms/login.form'
import { Logo } from '@/components/logo'
import { PageWrapper } from '@/components/page-wrapper'

const LoginPage = () => {
  return (
    <PageWrapper>
      <Logo as='link' to='/' size='xl' />
      <LoginForm />
    </PageWrapper>
  )
}

export { LoginPage }
