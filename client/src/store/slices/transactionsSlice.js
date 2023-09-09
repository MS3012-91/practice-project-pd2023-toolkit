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
  sumOfExpenses: 0,
  transactionsOnPageCount: 2
};

export const getTransactions = decorateAsyncThunk({
  key: `${TRANSACTIONS_SLICE_NAME}/get`,
  thunk: async (requestData) => {
    const { data } = await restController.getTransactions(requestData);
    return (data);
  },
});


const extraReducers = createExtraReducers({
  thunk: getTransactions,
  pendingReducer,
  fulfilledReducer: (state, { payload }) => {
    state.transactions = [...payload.foundTransactions];
    state.userName = payload.userName;
    state.sumOfExpenses = payload.sumOfExpenses;
    state.isFetching = false;
    state.transactionsOnPageCount = payload;
  },
  rejectedReducer,
});

const transactionSlice = createSlice({
  name: TRANSACTIONS_SLICE_NAME,
  initialState,
  extraReducers,
});

const { actions, reducer } = transactionSlice;

export const { setTransactionsOnPageCount } = actions;

export default reducer;
