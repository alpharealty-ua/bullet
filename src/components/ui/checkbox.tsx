interface CheckbotProps<Name extends string> {
  label: string
  name: Name
  checked?: boolean
  onChange: (name: Name, checked: boolean) => void
}

const Checkbox = <Name extends string>({
  label,
  name,
  onChange,
  checked,
}: CheckbotProps<Name>) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, event.target.checked)
  }

  return (
    <label className='relative z-[1] flex w-full cursor-pointer items-center justify-between px-4 py-2.5 select-none'>
      <span className='text-lg'>{label}</span>
      <input
        type='checkbox'
        className='peer checked:bg-success relative h-4 w-7 shrink-0 cursor-pointer appearance-none rounded-full bg-[#000] duration-300 after:absolute after:top-0 after:right-full after:bottom-0 after:my-auto after:h-3 after:w-3 after:translate-x-[calc(100%+2px)] after:rounded-full after:bg-white after:shadow-sm after:transition-[translate,right] checked:after:right-0 checked:after:-translate-x-0.5'
        name={name}
        checked={checked}
        onChange={handleChange}
      />
      <div className='bg-primary/20 peer-checked:bg-primary absolute top-0 right-0 bottom-0 left-0 z-[-1] rounded-xl transition-colors'></div>
    </label>
  )
}

export { Checkbox }
