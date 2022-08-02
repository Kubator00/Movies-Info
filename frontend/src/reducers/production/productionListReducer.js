import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverGraphQl } from "../../api";
import { gql, request } from "graphql-request";

export const fetchProductionList = createAsyncThunk('production/list', async (props) => {
    const { page, pageSize, orderBy, descending, category } = props;
    const query = gql`
    query ProductionList($page: Int, $pageSize: Int, $orderBy: String, $descending: String, $category: String){
        numberOfProductions(category: $category)
        productionList(page:$page, pageSize:$pageSize, orderBy:$orderBy, descending: $descending, category: $category){
            _id,
            name,
            category,
            directoryName,
            releaseDate,
            rating{
            rate,
            numberOfRates
            }
        }
    }`;

    const variables = {
        category,
        descending,
        orderBy,
        page,
        pageSize
    }

    return await request(serverGraphQl, query, variables).then((data) => data);
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
            console.log(action.payload)
            state.data = action.payload.productionList;
            state.numberOfRows = action.payload.numberOfProductions;
            state.category = action.payload.productionList[0]?.category;
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

