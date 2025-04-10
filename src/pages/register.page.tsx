import { AuthFormWrapper } from '@/components/auth-form-wrapper'
import { RegisterForm } from '@/components/forms/register.form'

const RegisterPage = () => {
  return (
    <AuthFormWrapper label='Register'>
      <RegisterForm />
    </AuthFormWrapper>
  )
}

export { RegisterPage }
