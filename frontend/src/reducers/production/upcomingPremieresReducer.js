import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"

export const fetchPremieres = createAsyncThunk('upcomingPremieres/fetch',async () => {
    return await Axios.get(api.production.premieres)
        .then(result => {
            return result.data;
        })
});

const initialState = {
    completed: false, data: [], error: ''
}

export const upcomingPremieresSlice = createSlice({
    name: 'upcomingPremieres', initialState, extraReducers: (builder) => {
        builder.addCase(fetchPremieres.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchPremieres.fulfilled, (state, action) => {
            state.data = action.payload;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchPremieres.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})

