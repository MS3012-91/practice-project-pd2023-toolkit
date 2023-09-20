import { createSlice } from '@reduxjs/toolkit';
import { updateStoreAfterUpdateContest } from './contestByIdSlice';
import * as restController from '../../api/rest/restController';
import {
  decorateAsyncThunk,
  pendingReducer,
  fulfilledReducer,
  rejectedReducer,
} from '../../utils/store';

const CONTEST_UPDATION_SLICE_NAME = 'contestUpdation';

const initialState = {
  isFetching: true,
  error: null,
};

export const updateContest = decorateAsyncThunk({
  key: CONTEST_UPDATION_SLICE_NAME,
  thunk: async (payload, { dispatch }) => {
    console.log('payload', payload);
      const contestId = payload.get('contestId');
      console.log('a', contestId);
    const { data } = await restController.updateContest(payload, contestId);
    dispatch(updateStoreAfterUpdateContest(data));
  },
});

// export const updateContest = decorateAsyncThunk({
//   key: CONTEST_UPDATION_SLICE_NAME,
//   thunk: async ({ data, contestId }, { dispatch }) => {
//     console.log('data', data);
//     console.log('contestId', contestId);
//     const updatedData = { ...data, contestId }; // Добавляем contestId к данным
//     const responseData = await restController.updateContest(updatedData);
//     dispatch(updateStoreAfterUpdateContest(responseData.data));
//   },
// });

const reducers = {
  clearContestUpdationStore: () => initialState,
};

const extraReducers = (builder) => {
  builder.addCase(updateContest.pending, pendingReducer);
  builder.addCase(updateContest.fulfilled, fulfilledReducer);
  builder.addCase(updateContest.rejected, rejectedReducer);
};

const contestUpdationSlice = createSlice({
  name: CONTEST_UPDATION_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = contestUpdationSlice;

export const { clearContestUpdationStore } = actions;

export default reducer;
