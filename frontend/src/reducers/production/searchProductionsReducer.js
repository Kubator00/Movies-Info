import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"


export const fetchSearchProductions = createAsyncThunk('searchProductions/fetch', async (props) => {
    const {keyword} = props;
    return await Axios.get(api.production.search, {
        params: {
            keyword: keyword,
        }
    }).then(result => {
        return result.data;
    })
});

export const fetchRecommendedProductions = createAsyncThunk('searchProductions/recommendedProductions', async(props) => {
    const {limit} = props;
    return await Axios.get(api.production.recommended, {
        params: {
            limit: limit,
        }
    }).then(result => {
        return result.data;
    })
});

const initialState = {
    completed: false, foundProductions: [], recommendedProductions: [], error: '', numberOfResult: 0, keyword: ''
}

export const searchProductionsSlice = createSlice({
    name: 'searchProductions', initialState,
    reducers: {
        cleanUpSearchProductions: (state) => {
            state.foundProductions = []
            state.completed = false;
            state.numberOfResult = 0;
            state.keyword = '';
        },
        setKeyword: (state, action) => {
            state.keyword = action.payload.keyword
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSearchProductions.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchSearchProductions.fulfilled, (state, action) => {
            state.foundProductions = action.payload;
            state.numberOfResult = action.payload.length;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchSearchProductions.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })

        builder.addCase(fetchRecommendedProductions.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchRecommendedProductions.fulfilled, (state, action) => {
            state.recommendedProductions = action.payload;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchRecommendedProductions.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})

export const {cleanUpSearchProductions, setKeyword} = searchProductionsSlice.actions;