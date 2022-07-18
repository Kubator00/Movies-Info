import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../api";
import Axios from "axios"

export const fetchLastNews = createAsyncThunk('lastNews/fetch', async() => {
    return await Axios.get(api.news.last).then(result => {
        return result.data;
    })
});

const initialState = {
    completed: false, data: [], error: ''
}

export const lastNewsSlice = createSlice({
    name: 'lastNews', initialState, extraReducers: (builder) => {
        builder.addCase(fetchLastNews.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchLastNews.fulfilled, (state, action) => {
            state.data = action.payload;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchLastNews.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})

