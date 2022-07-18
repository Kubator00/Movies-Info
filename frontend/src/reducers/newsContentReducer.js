import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../api";
import Axios from "axios"

export const fetchNews = createAsyncThunk('news/content', async (props) => {
    const {id} = props;
    return await Axios.get(api.news.content, {
        params: {
            id: id
        }
    }).then(result => {
        return result.data;
    })
});

const initialState = {
    completed: false, data: {}, error: ''
}

export const newsContentSlice = createSlice({
    name: 'news', initialState, extraReducers: (builder) => {
        builder.addCase(fetchNews.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchNews.fulfilled, (state, action) => {
            state.data = action.payload;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchNews.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})

