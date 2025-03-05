import { RegisterForm } from '@/components/forms/register.form'
import { Logo } from '@/components/logo'

const RegisterPage = () => {
  return (
    <>
      <header className='flex items-center justify-center px-3 py-2'>
        <Logo as='link' to='/' size='lg' />
      </header>
      <RegisterForm />
    </>
  )
}

export { RegisterPage }
