import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"

export const fetchProductionList = createAsyncThunk('production/list', async (props) => {
    const {page, pageSize, orderBy, descending, category} = props;
    return await Axios.get(api.production.list, {
        params: {
            page: page,
            pageSize: pageSize,
            orderBy: orderBy,
            descending: descending,
            category: category
        }
    }).then(result => {
        return result.data;
    })
});


const initialState = {
    completed: false, data: [], numberOfRows: 0, category: '', error: ''
}

export const productionListSlice = createSlice({
    name: 'production', initialState, extraReducers: (builder) => {
        builder.addCase(fetchProductionList.pending, state => {
            state.completed = false;
        })
        builder.addCase(fetchProductionList.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.numberOfRows = action.payload.numberOfRows;
            state.category = action.payload.category;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchProductionList.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})

