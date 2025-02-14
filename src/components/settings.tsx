import { useAppContext } from '@/context/use-app-context'
import { settingsEntries, SettingsKeys } from '@/lib/constants'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

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
        <Button text='Login' image='button' />
        <Button text='Register' image='button' />
      </div>
    </div>
  )
}

export { Settings }
