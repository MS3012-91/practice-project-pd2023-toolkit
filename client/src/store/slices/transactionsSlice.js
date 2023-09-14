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
  transactionsOnPageCount: '2',
  transactions: [],
  userName: null,
  sumOfExpenses: 0,
  countPages: 0
};

export const getTransactions = decorateAsyncThunk({
  key: `${TRANSACTIONS_SLICE_NAME}/get`,
  thunk: async (requestData) => {
    const { data } = await restController.getTransactions(requestData);
    console.log('requestData', data);
    return (data);
  },
}
);



const extraReducers = createExtraReducers({
  thunk: getTransactions,
  pendingReducer,
  fulfilledReducer: (state, { payload }) => {
    state.transactionsOnPageCount = state.transactionsOnPageCount;
    state.transactions = [...payload.foundTransactions];
    state.userName = payload.userName;
    state.sumOfExpenses = payload.sumOfExpenses;
    state.isFetching = false;
    state.countPages = payload.countPages;
  },
  rejectedReducer,
});

const transactionSlice = createSlice({
  name: TRANSACTIONS_SLICE_NAME,
  initialState,
  extraReducers,
  reducers: {
    setTransactionsOnPageCount: (state, { payload }) => {
      state.transactionsOnPageCount = payload;
    },

    setTransactionPage: (state, { payload }) => {
      state.transactionPage = payload;
    },
    // setCountPages: (state, { payload }) => {
    //   state.countPages = payload;
    // },
  },
});


const { actions, reducer } = transactionSlice;

export const {setTransactionsOnPageCount } = actions;

export default reducer;
