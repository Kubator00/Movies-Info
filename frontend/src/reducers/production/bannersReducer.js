import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"

export const fetchBanners = createAsyncThunk('banners/fetch', async() => {
    return await Axios.get(api.production.banners).then(result => {
        return result.data;
    })
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
            state.data = action.payload;
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

