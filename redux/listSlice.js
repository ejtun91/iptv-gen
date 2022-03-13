import { createSlice } from "@reduxjs/toolkit";
import { uuid } from "uuidv4";

const listSlice = createSlice({
  name: "list",
  initialState: {
    items: [],
    quantity: 0,
    uid: uuid(),
  },
  reducers: {
    addList: (state, action) => {
      if (
        !(state.items.filter((e) => e._id === action.payload._id).length > 0)
      ) {
        state.items.push(action.payload);
        state.quantity += 1;
      }
    },
    addListPerPage: (state, action) => {
      if (
        !(
          state.items.filter((e, i) =>
            action.payload[i]
              ? e._id === action.payload[i]._id
              : e._id === action.payload._id
          ).length > 0
        )
      ) {
        (state.items = [...state.items, ...action.payload]),
          (state.quantity += action.payload.length);
      }
    },
    removeFromList: (state, action) => {
      const item = state.items.find(
        (item) => item.title === action.payload.title
      );
      if (item) {
        state.quantity -= 1;
        state.items = state.items.filter((element) => element !== item);
      }
    },
    reset: (state) => {
      state.items = [];
      state.quantity = 0;
    },
  },
});

export const { addList, reset, removeFromList, addListPerPage } =
  listSlice.actions;
export default listSlice.reducer;
