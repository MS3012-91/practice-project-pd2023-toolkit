import { bindActionCreators, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import {
    createExtraReducers,
    decorateAsyncThunk,
  fulfilledReducer,
  pendingReducer,
  rejectedReducer,
} from '../../utils/store';


const TRANSACTIONS_SLICE_NAME = 'transactions';

const initialState = {
  isFetching: false,
  error: null,
  transactions: [],
};



export const getTransactions = decorateAsyncThunk({
    key: `${TRANSACTIONS_SLICE_NAME}/get`,
    thunk: async () => {
    const { data } = await restController.getTransactions();
    return data;
    } })
    
//     createAsyncThunk(
//   `${TRANSACTIONS_SLICE_NAME}/get`,
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { data } = await restController.getTransactions();
//       return data;
//     } catch (err) {
//       return rejectWithValue({
//         data: err?.response?.data ?? 'Gateway Timeout',
//         status: err?.response?.status ?? 504,
//       });
//     }
//   }
// );

// const extraReducers = builder => {
//     builder.addCase(getTransactions.pending, pendingReducer);
//     builder.addCase(getTransactions.fulfilled, (state, { payload }) => {
//         state.transactions = [...payload];
//         state.isFetching = false;
//     });
//   builder.addCase(getTransactions.rejected, rejectedReducer);
// };

const extraReducers = createExtraReducers(
  { thunk: getTransactions,
  pendingReducer,
  fulfilledReducer : (state, { payload }) => {
    state.transactions = [...payload];
    state.isFetching = false;
  },
  rejectedReducer}
);

const transactionSlice = createSlice({
  name: TRANSACTIONS_SLICE_NAME,
  initialState,
  extraReducers,
});

const { reducer } = transactionSlice;

export default reducer;
