import { createSlice } from "@reduxjs/toolkit";
import { getUsers } from "@/utils/userStorage";

const storedCurrentUserEmail = localStorage.getItem("currentUserEmail");
const users = getUsers();
const currentUser = users.find((user) => user.email === storedCurrentUserEmail);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    items: currentUser ? currentUser.transactions : [],
  },
  reducers: {
    loadTransactions: (state, action) => {
      state.items = action.payload;
    },
    clearTransactions: (state) => {
      state.items = [];
    },
    addTransaction: (state, action) => {
      state.items.push(action.payload);
    },
    editTransaction: (state, action) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    renameCategoryInTransactions: (state, action) => {
      const { oldName, newName } = action.payload;
      state.items = state.items.map((t) =>
        t.category === oldName ? { ...t, category: newName } : t,
      );
    },
  },
});

export const {
  loadTransactions,
  clearTransactions,
  addTransaction,
  editTransaction,
  deleteTransaction,
    renameCategoryInTransactions,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;

export const selectTransactions = (state) => state.transactions.items;

export const selectTotalIncome = (state) =>
  state.transactions.items
    .filter((t) => t.type === "income")
    .reduce((total, t) => total + t.amount, 0);

export const selectTotalExpense = (state) =>
  state.transactions.items
    .filter((t) => t.type === "expense")
    .reduce((total, t) => total + t.amount, 0);

export const selectBalance = (state) =>
  selectTotalIncome(state) - selectTotalExpense(state);
