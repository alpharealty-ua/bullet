import { RegisterForm } from '@/components/forms/register.form'
import { Logo } from '@/components/logo'

const RegisterPage = () => {
  return (
    <>
      <Logo as='link' to='/' size='xl' />
      <RegisterForm />
    </>
  )
}

export { RegisterPage }
