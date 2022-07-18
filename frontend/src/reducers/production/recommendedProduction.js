import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"



export const fetchRecommendedProductions = createAsyncThunk('recommendedProduction/fetch', async(props) => {
    const {productionId,limit} = props;
    return await Axios.get(api.production.recommended, {
        params: {
            productionId: productionId,
            limit: limit,
        }
    }).then(result => {
        return result.data;
    })
});

const initialState = {
    completed: false, data: [], error: ''
}

export const recommendedProductionsSlice = createSlice({
    name: 'recommendedProduction', initialState,
    reducers: {
        cleanUpRecommendedProduction: (state) => {
            state.data = []
            state.completed = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRecommendedProductions.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchRecommendedProductions.fulfilled, (state, action) => {
            state.data = action.payload;
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

export const {cleanUpRecommendedProduction} = recommendedProductionsSlice.actions;