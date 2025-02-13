import { useAppContext } from '@/context/use-app-context'
import { settingsEntries, SettingsKeys } from '@/lib/constants'

const Settings = () => {
  const { settings, changeSettings } = useAppContext()

  const handleChange = (name: SettingsKeys, value: boolean) => {
    changeSettings({ [name]: value })
  }

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-3xl'>Settings</h3>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex flex-col gap-2'>
          {settingsEntries.map(([key, value], i) => (
            <Checkbox
              key={i}
              label={value}
              name={key}
              onChange={handleChange}
              checked={settings[key]}
            />
          ))}
        </div>
        <Button text='Login' />
        <Button text='Register' />
      </div>
    </div>
  )
}

export { Settings }

// TODO: MOVE TO COMPONENT
const Button = ({ text }: { text: string }) => {
  return (
    <button className='relative inline-flex transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed'>
      <span className='absolute inset-0 inline-flex cursor-pointer items-center justify-center text-3xl font-bold'>
        {text}
      </span>
      <svg
        width='283'
        height='76'
        viewBox='0 0 283 76'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M2 4H274.635L271.975 72L7.31971 69.5L2 4Z' fill='#FF9B2A' />
        <path
          d='M3.9165 2.99121C92.8331 2.99121 181.777 3.32183 270.71 3.32183'
          stroke='#010101'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M2 70.1064C66.7996 70.1064 131.686 69.7845 196.477 70.1432C224.878 70.3004 252.707 72.7513 281 72.7513'
          stroke='#010101'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M274.196 4.31445C271.539 26.64 270.709 48.7701 270.709 71.0989'
          stroke='#010101'
          strokeWidth='3'
          strokeLinecap='round'
        />
        <path
          d='M2.17705 2C2.17705 12.8361 2.01187 23.6745 2.17705 34.5106C2.24502 38.9693 4.11033 43.3621 4.59893 47.8087C5.72803 58.0844 4.79268 63.4157 4.79268 73.7029'
          stroke='#010101'
          strokeWidth='3'
          strokeLinecap='round'
        />
      </svg>
    </button>
  )
}

// TODO: MOVE TO COMPONENT
const Checkbox = <Name extends string>({
  label,
  name,
  onChange,
  checked,
}: {
  label: string
  name: Name
  checked?: boolean
  onChange: (name: Name, checked: boolean) => void
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, event.target.checked)
  }

  return (
    <label className='relative z-[1] flex w-full cursor-pointer items-center justify-between px-4 py-2.5 select-none'>
      <span className='text-lg'>{label}</span>
      <input
        type='checkbox'
        className='peer checked:bg-success relative h-4 w-7 cursor-pointer appearance-none rounded-full bg-[#000] duration-300 after:absolute after:top-0 after:right-full after:bottom-0 after:my-auto after:h-3 after:w-3 after:translate-x-[calc(100%+2px)] after:rounded-full after:bg-white after:shadow-sm after:transition-[translate,right] checked:after:right-0 checked:after:-translate-x-0.5'
        name={name}
        checked={checked}
        onChange={handleChange}
      />
      <div className='absolute top-0 right-0 bottom-0 left-0 z-[-1] rounded-xl bg-[#FF9B2A]/20 transition-colors peer-checked:bg-[#FF9B2A]'></div>
    </label>
  )
}
