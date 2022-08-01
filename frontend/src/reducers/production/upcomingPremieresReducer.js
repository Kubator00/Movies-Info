import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import  {serverGraphQl} from "../../api";
import {gql, request} from "graphql-request";

export const fetchPremieres = createAsyncThunk('upcomingPremieres/fetch',async () => {
    const query = gql`
        {
            upcomingPremiersList{
                production{
                    name,
                    directoryName,
                     _id
                }
            }
        }`

    return await request(serverGraphQl, query).then((data) => data);
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
            console.log(action.payload.upcomingPremiersList)
            state.data = action.payload.upcomingPremiersList;
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

