import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {serverGraphQl, serverNewsImages} from "../../api";
import {gql, request} from "graphql-request";

export const fetchNews = createAsyncThunk('news/content', async (props) => {
    const {id} = props;
    const query = gql`
        {
          news(id: "${id}") {
            name,
            htmlContent,
            backgroundImg,
            _id,
            author,
            date
          }
        }`

    return await request(serverGraphQl, query).then((data) => data);
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
            state.data = action.payload.news;
            console.log(state.data)
            state.data.htmlContent = state.data.htmlContent.replace("${serverNewsImages}", `${serverNewsImages}/${state.data._id}`);
            console.log(state.data.htmlContent)
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

