import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AdminPersonnel } from '@/mocks/data/adminPersonnel'
import {
  MOCK_ADMIN_PERSONNEL,
  normalizePersonnel,
} from '@/mocks/data/adminPersonnel'
import type { SystemSetting } from '@/mocks/data/adminSystemSettings'
import { MOCK_SYSTEM_SETTINGS } from '@/mocks/data/adminSystemSettings'
import type { RootState } from '@/app/store'

interface AdminState {
  personnel: AdminPersonnel[]
  systemSettings: SystemSetting[]
}

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

const initialState: AdminState = {
  personnel: useMock ? normalizePersonnel(MOCK_ADMIN_PERSONNEL) : [],
  systemSettings: MOCK_SYSTEM_SETTINGS,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    addPersonnel: (state, action: PayloadAction<AdminPersonnel>) => {
      state.personnel.push(action.payload)
    },
    updatePersonnel: (
      state,
      action: PayloadAction<{ id: string; data: Partial<AdminPersonnel> }>,
    ) => {
      const index = state.personnel.findIndex((p) => p.id === action.payload.id)
      if (index === -1) return
      state.personnel[index] = {
        ...state.personnel[index],
        ...action.payload.data,
      }
    },
    deletePersonnel: (state, action: PayloadAction<string>) => {
      state.personnel = state.personnel.filter((p) => p.id !== action.payload)
    },

    addSystemSetting: (state, action: PayloadAction<SystemSetting>) => {
      state.systemSettings.push(action.payload)
    },
    updateSystemSetting: (
      state,
      action: PayloadAction<{ id: string; data: Partial<SystemSetting> }>,
    ) => {
      const index = state.systemSettings.findIndex(
        (s) => s.id === action.payload.id,
      )
      if (index === -1) return
      state.systemSettings[index] = {
        ...state.systemSettings[index],
        ...action.payload.data,
      }
    },
    deleteSystemSetting: (state, action: PayloadAction<string>) => {
      state.systemSettings = state.systemSettings.filter(
        (s) => s.id !== action.payload,
      )
    },
  },
})

export const {
  addPersonnel,
  updatePersonnel,
  deletePersonnel,
  addSystemSetting,
  updateSystemSetting,
  deleteSystemSetting,
} = adminSlice.actions

export const selectAdminPersonnel = (state: RootState) => state.admin.personnel

export const selectPersonnelByCategory = (
  state: RootState,
  category: AdminPersonnel['category'],
) => state.admin.personnel.filter((p) => p.category === category)
export const selectSystemSettings = (state: RootState) => state.admin.systemSettings

export default adminSlice.reducer
