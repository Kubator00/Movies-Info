import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api, {serverGraphQl} from "../../api";
import Axios from "axios"
import {gql, request} from "graphql-request";

export const fetchLastNews = createAsyncThunk('lastNews/fetch', async () => {
    const query = gql`
     {
      newsList(limit:10, sort:"descending") {
        name,
        img,
        _id
      }
    }
    `

    return await request(serverGraphQl, query).then((data) => data);
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
            console.log(action.payload)
            state.data = action.payload.newsList;
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

