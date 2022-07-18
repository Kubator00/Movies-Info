import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"

export const fetchProduction = createAsyncThunk('production/info', async (props) => {
    const {movieName} = props;

    return await Axios.get(api.production.info, {
        params: {
            movieName: decodeURI(movieName),
        }
    }).then(result => {
        return result.data;
    })
});

const initialState = {
    completed: false, data: {}, error: ''
}

export const productionInfoSlice = createSlice({
    name: 'production', initialState,
    reducers: {
        cleanUpInfo: (state) => {
            state.data = {}
            state.completed = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProduction.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchProduction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchProduction.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})

export const {cleanUpInfo} = productionInfoSlice.actions;