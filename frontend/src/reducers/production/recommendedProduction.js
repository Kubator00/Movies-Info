import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import  {serverGraphQl} from "../../api";
import {gql, request} from "graphql-request";



export const fetchRecommendedProductions = createAsyncThunk('recommendedProduction/fetch', async(props) => {
    const {productionId,limit=4} = props;
    const query = gql`
      {
          recommendedProductionsList(productionId:"${productionId}", limit: ${limit}){
            name,
            category,
            directoryName,
        }
      }`
    return await request(serverGraphQl, query).then((data) => data);
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
            state.data = action.payload.recommendedProductionsList;
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