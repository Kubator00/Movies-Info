import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {serverGraphQl} from "../../api";
import {gql, request} from "graphql-request";

export const fetchBanners = createAsyncThunk('banners/fetch', async () => {
    const query = gql`{
      bannerList {
        name
        banner
      }
    }`

    return await request(serverGraphQl, query).then((data) => data);
});

const initialState = {
    completed: false, data: [], error: ''
}

export const bannersSlice = createSlice({
    name: 'banners', initialState, extraReducers: (builder) => {
        builder.addCase(fetchBanners.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchBanners.fulfilled, (state, action) => {
            state.data = action.payload?.bannerList;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchBanners.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})

