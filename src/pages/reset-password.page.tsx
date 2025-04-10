import { ResetPasswordForm } from '@/components/forms/reset-password.form.tsx'
import { AuthFormWrapper } from '@/components/auth-form-wrapper'

const ResetPasswordPage = () => {
  return (
    <AuthFormWrapper label='Reset Password'>
      <ResetPasswordForm />
    </AuthFormWrapper>
  )
}

export { ResetPasswordPage }
