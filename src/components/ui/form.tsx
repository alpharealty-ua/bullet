import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, getValues } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)
  const [isFilled, setIsFilled] = React.useState(
    Boolean(getValues(fieldContext.name)),
  )

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    isFilled,
    setIsFilled,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot='form-item'
        className={cn('flex flex-col gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot='form-label'
      data-error={!!error}
      className={cn('data-[error=true]:text-red-500', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot='form-control'
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  afterSlot?: React.ReactNode
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ afterSlot, className, onBlur, ...props }, ref) => {
    const { error, isFilled, setIsFilled } = useFormField()

    return (
      <div className='relative'>
        <Input
          ref={ref}
          className={cn(className, {
            'border-green': !error && isFilled,
            'border-red': error,
          })}
          onBlur={(e) => {
            setIsFilled(Boolean(e.target.value))
            onBlur && onBlur(e)
          }}
          {...props}
        />
        {afterSlot}
      </div>
    )
  },
)
FormInput.displayName = 'FormInput'

const FormInputPassword = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const handleMouseDownPassword = () => setShowPassword(!showPassword)
    const handleMouseUpPassword = () => setShowPassword(!showPassword)

    return (
      <FormInput
        ref={ref}
        placeholder='Password'
        type={showPassword ? 'text' : 'password'}
        afterSlot={
          <button
            className='absolute top-1/2 right-4 -translate-y-1/2 text-black'
            onMouseUp={handleMouseUpPassword}
            onMouseDown={handleMouseDownPassword}
            type='button'
          >
            {showPassword ? (
              <MdOutlineVisibility size={28} />
            ) : (
              <MdOutlineVisibilityOff size={28} />
            )}
          </button>
        }
        {...props}
      />
    )
  },
)
FormInputPassword.displayName = 'FormInputPassword'

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot='form-description'
      id={formDescriptionId}
      className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot='form-message'
      id={formMessageId}
      className={cn('text-red text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormInput,
  FormInputPassword,
}
