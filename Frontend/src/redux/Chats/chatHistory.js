import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
}

export const chatHistory = createSlice({
  name: 'chatHistory',
  initialState,
  reducers: {
    setChatHistory: (state,data) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = data
    },
  },
})

// Action creators are generated for each case reducer function
export const { setChatHistory } = chatHistory.actions

export default chatHistory.reducer