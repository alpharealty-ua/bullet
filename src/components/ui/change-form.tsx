import { ROUTES } from '@/routes/path'
import { Link } from 'react-router'

type FormType = 'login' | 'register' | 'forgotPassword'

interface FormTypeConfig {
  title: string
  route: string
  buttonText: string
}

const formTypes: Record<FormType, FormTypeConfig> = {
  login: {
    title: 'Don\'t have an account yet?',
    route: ROUTES.auth.register,
    buttonText: 'Sign up',
  },
  register: {
    title: 'Already have an account?',
    route: ROUTES.auth.login,
    buttonText: 'Sign in',
  },
  forgotPassword: {
    title: 'Forgot password?',
    route: ROUTES.auth.forgotPassword,
    buttonText: 'Reset password',
  }
}

const ChangeForm = ({ type }: { type: FormType }) => {
  const formConfig = formTypes[type]
  return (
    <div className='flex flex-col items-center gap-1'>
      <span>
        {formConfig.title}
      </span>
      <Link
        to={formConfig.route}
        className='text-primary'
      >
        {formConfig.buttonText}
      </Link>
    </div>
  )
}

export { ChangeForm, type FormType }