import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const productList = createSlice({
  name: 'productList',
  initialState,
  reducers: {
    setProductList: (state,data) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = data.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setProductList } = productList.actions

export default productList.reducer