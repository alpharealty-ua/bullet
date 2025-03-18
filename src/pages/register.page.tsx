import { RegisterForm } from '@/components/forms/register.form'
import { Logo } from '@/components/logo'
import { PageWrapper } from '@/components/page-wrapper'

const RegisterPage = () => {
  return (
    <PageWrapper>
      <Logo as='link' to='/' size='xl' />
      <RegisterForm />
    </PageWrapper>
  )
}

export { RegisterPage }
