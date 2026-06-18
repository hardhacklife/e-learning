import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  FieldLabel,
  SelectInput,
  TextArea,
  TextInput,
} from '@/features/formations/components/formFields'
import type {
  SystemSetting,
  SystemSettingStatus,
} from '@/mocks/data/adminSystemSettings'

export interface SystemSettingFormValues {
  category: string
  name: string
  value: string
  status: SystemSettingStatus
}

interface SystemSettingFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: SystemSettingFormValues) => void
  setting?: SystemSetting
  categories: string[]
}

export function SystemSettingFormModal({
  open,
  onClose,
  onSubmit,
  setting,
  categories,
}: SystemSettingFormModalProps) {
  const [values, setValues] = useState<SystemSettingFormValues>({
    category: '',
    name: '',
    value: '',
    status: 'enabled',
  })

  useEffect(() => {
    if (setting) {
      setValues({
        category: setting.category,
        name: setting.name,
        value: setting.value,
        status: setting.status,
      })
    } else {
      setValues({
        category: categories[0] ?? '',
        name: '',
        value: '',
        status: 'enabled',
      })
    }
  }, [setting, open, categories])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={setting ? 'Modifier le paramètre' : 'Nouveau paramètre'}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(values)
          onClose()
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Catégorie</FieldLabel>
            <TextInput
              list="sys-categories"
              value={values.category}
              onChange={(e) =>
                setValues((v) => ({ ...v, category: e.target.value }))
              }
              required
            />
            <datalist id="sys-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <FieldLabel>État</FieldLabel>
            <SelectInput
              value={values.status}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  status: e.target.value as SystemSettingStatus,
                }))
              }
            >
              <option value="enabled">Actif</option>
              <option value="warning">Attention</option>
              <option value="disabled">Désactivé</option>
            </SelectInput>
          </div>
        </div>
        <div>
          <FieldLabel>Paramètre</FieldLabel>
          <TextInput
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <FieldLabel>Valeur</FieldLabel>
          <TextArea
            value={values.value}
            onChange={(e) => setValues((v) => ({ ...v, value: e.target.value }))}
            rows={2}
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            {setting ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
