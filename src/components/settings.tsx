import { settingsEntries, SettingsKeys } from '@/lib/constants'
import { useSettingsStore } from '@/store/settings.store'
import { Checkbox } from '@/components/ui/checkbox'

const Settings = () => {
  const { change, ...settings } = useSettingsStore()

  const handleChange = (name: SettingsKeys, value: boolean) => {
    change({ [name]: value })
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
      </div>
    </div>
  )
}

export { Settings }
