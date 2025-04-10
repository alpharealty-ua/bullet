import { ForgotPasswordForm } from '@/components/forms/forgot-password.form.tsx'
import { AuthFormWrapper } from '@/components/auth-form-wrapper'

const ForgotPasswordPage = () => {
  return (
    <AuthFormWrapper label='Forgot Password'>
      <ForgotPasswordForm />
    </AuthFormWrapper>
  )
}

export { ForgotPasswordPage }
