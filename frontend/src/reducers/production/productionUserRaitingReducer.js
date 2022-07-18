import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"

export const fetchProductionUserRating = createAsyncThunk('movieUserRating/fetch', async(props) => {
    const {id} = props;
    return await Axios(
        {
            method: 'post',
            url: api.production.userRating,
            headers: {
                "X-USER-TOKEN": localStorage.getItem('token'),
                "X-EMAIL": localStorage.getItem('email')
            },
            data: {
                movieId: id
            }
        }).then(result => {
        return result.data;
    })
});

export const setProductionUserRating = createAsyncThunk('movieUserRating/set', async(props) => {
    const {id, rating} = props;
    return await Axios(
        {
            method: 'put',
            url: api.production.userRating,
            headers: {
                "X-USER-TOKEN": localStorage.getItem('token'),
                "X-EMAIL": localStorage.getItem('email')
            },
            data: {
                movieId: id,
                rating: rating
            }
        }).then(result => {
        return rating;
    })
});

const initialState = {
    completed: false, rating: 0, error: ''
}

export const productionUserRatingSlice = createSlice({
    name: 'movieUserRating', initialState, extraReducers: (builder) => {
        builder.addCase(fetchProductionUserRating.pending, state => {
            state.setNewComment = false;
            state.completed = false;
        })
        builder.addCase(fetchProductionUserRating.fulfilled, (state, action) => {
            state.rating = action.payload.rating;
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
            state.rating = action.payload;
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

