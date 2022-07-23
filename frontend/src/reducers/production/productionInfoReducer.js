import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api, {serverGraphQl} from "../../api";
import Axios from "axios"
import {request, gql} from 'graphql-request'

export const fetchProduction = createAsyncThunk('production/info', async (props) => {
    const {movieName} = props;
    const query = gql`
        {
          production(name: "${movieName}") {
            _id,
            name,
            category,
            releaseDate,
            shortDescription,
            trailerUrl,
            directoryName,
            directors,
            writers,
            mainStars,
            rating{
                rate,
                numberOfRates
            }
          }
        }`

    return await request(serverGraphQl, query).then((data) => data);
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
            state.data = action.payload.production;
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