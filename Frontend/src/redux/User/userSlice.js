import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state,data) => {
      state.value = data.payload
    },
  },
})

export const { setUser } = user.actions

export default user.reducer