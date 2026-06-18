import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthResponse, AuthState, User } from '@/types/auth'

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken ?? null
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.token = null
      state.refreshToken = null
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, setUser, logout } = authSlice.actions
export default authSlice.reducer
