import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import { pendingReducer, rejectedReducer } from '../../utils/store';

const OFFERS_SLICE_NAME = 'offers';
const initialState = {
  isFetching: false,
  error: null,
  offers: [],
};

export const getOffers = createAsyncThunk(
  `${OFFERS_SLICE_NAME}/get`,
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await restController.getOffers();
      return data;
    } catch (err) {
      return rejectWithValue({
        data: err?.response?.data ?? 'Gateway Timeout',
        status: err?.response?.status ?? 504,
      });
    }
  }
);

const extraReducers = (builder) => {
  builder.addCase(getOffers.pending, pendingReducer);
  builder.addCase(getOffers.rejected, rejectedReducer);
  builder.addCase(getOffers.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.offers = [...payload];
  });
};

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  extraReducers,
});

const { reducer } = offersSlice;
export default reducer;