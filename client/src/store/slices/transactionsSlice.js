import { createSlice } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import {
  createExtraReducers,
  decorateAsyncThunk,
  pendingReducer,
  rejectedReducer,
} from '../../utils/store';

const TRANSACTIONS_SLICE_NAME = 'transactions';

const initialState = {
  isFetching: false,
  error: null,
  transactions: [],
  userName: null,
};

export const getTransactions = decorateAsyncThunk({
  key: `${TRANSACTIONS_SLICE_NAME}/get`,
  thunk: async () => {
    const { data } = await restController.getTransactions();
    console.log('totalData', data);
    console.log('data', data.foundTransactions);
    console.log('data.userName', data.userName);
    return (data);
  },
});

const extraReducers = createExtraReducers({
  thunk: getTransactions,
  pendingReducer,
  fulfilledReducer: (state, { payload }) => {
    console.log('payload', [...payload.foundTransactions]);
    state.transactions = [...payload.foundTransactions];
    state.userName = payload.userName;
    state.isFetching = false;
  },
  rejectedReducer,
});

const transactionSlice = createSlice({
  name: TRANSACTIONS_SLICE_NAME,
  initialState,
  extraReducers,
});

const { reducer } = transactionSlice;

export default reducer;