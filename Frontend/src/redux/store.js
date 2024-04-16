import { configureStore } from '@reduxjs/toolkit'
import chatHistoryReducer from './Chats/chatHistory'
import productListReducer from './ProductList/productList'

export const store = configureStore({
    reducer: {
        chatHistory: chatHistoryReducer,
        productList: productListReducer,
      },
})

