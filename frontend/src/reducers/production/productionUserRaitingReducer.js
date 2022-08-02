import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverGraphQl } from "../../api";
import { gql, request } from "graphql-request";

export const fetchProductionUserRating = createAsyncThunk('movieUserRating/fetch', async (props) => {
    const { id } = props;
    const query = gql`
            query Query($productionId: String, $userToken: String, $userEmail: String) {
                productionRating(
                    productionId: $productionId,
                    userToken: $userToken, 
                    userEmail: $userEmail
                )
                {
                    rating
                }
       }`;

    const variables = {
        productionId: id,
        userToken: localStorage.getItem('token'),
        userEmail: localStorage.getItem('email')
    };

    return await request(serverGraphQl, query, variables).then((data) => data);
});

export const setProductionUserRating = createAsyncThunk('movieUserRating/set', async (props) => {
    const { id, rating } = props;
    const query = gql`
       mutation{
            addRating(
                productionId:"${id}",
                newRating: ${rating},
                userToken: "${localStorage.getItem('token')}", 
                userEmail: "${localStorage.getItem('email')}"
            ){
                rating
            }
       }`

    return await request(serverGraphQl, query).then((data) => data);
});

const initialState = {
    completed: false, rating: 0, error: ''
}

export const productionUserRatingSlice = createSlice({
    name: 'movieUserRating', initialState,
    reducers: {
        cleanUpUserRating: (state) => {
            state.completed = false;
            state.rating = 0;
            state.error = '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductionUserRating.pending, state => {
            state.setNewComment = false;
            state.completed = false;
        })
        builder.addCase(fetchProductionUserRating.fulfilled, (state, action) => {
            state.rating = action.payload.productionRating.rating;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchProductionUserRating.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })

        builder.addCase(setProductionUserRating.pending, state => {
            state.completed = false;
        })
        builder.addCase(setProductionUserRating.fulfilled, (state, action) => {
            state.rating = action.payload.addRating.rating;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(setProductionUserRating.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})


export const { cleanUpUserRating } = productionUserRatingSlice.actions;