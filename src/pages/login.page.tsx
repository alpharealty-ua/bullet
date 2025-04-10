import { AuthFormWrapper } from '@/components/auth-form-wrapper'
import { LoginForm } from '@/components/forms/login.form'

const LoginPage = () => {
  return (
    <AuthFormWrapper label='Login'>
      <LoginForm />
    </AuthFormWrapper>
  )
}

export { LoginPage }
