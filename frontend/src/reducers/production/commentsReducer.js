import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"

export const fetchComments = createAsyncThunk('comments/fetch',
    async (props) => {
        const {page, pageSize, productionId} = props;
        return await Axios.get(api.production.comment.get, {
            params: {
                page: page,
                pageSize: pageSize,
                productionId: productionId
            }
        }).then(result => {
            return result.data;
        })
    });

export const addNewComment = createAsyncThunk('comments/add',
    async (props) => {
        const {productionId, content} = props;
        return await Axios(
            {
                method: 'post',
                url: api.production.comment.add,
                headers: {
                    "X-USER-TOKEN": localStorage.getItem('token'),
                    "X-EMAIL": localStorage.getItem('email')
                },
                data: {
                    productionId: productionId,
                    content: content
                }
            }).then(result => {
            return result.data;
        })
    });


export const deleteComment = createAsyncThunk('comments/delete',
    async (props) => {
        const {id} = props;
        return await Axios(
            {
                method: 'delete',
                url: api.production.comment.delete,
                headers: {
                    "X-USER-TOKEN": localStorage.getItem('token'),
                    "X-EMAIL": localStorage.getItem('email')
                },
                data: {
                    commentId: id
                }
            }).then(result => {
            return result.data;
        })
    });
const initialState = {
    completed: false, comments: [], error: '', pageSize: 5, page: 1, numberOfComments: 0, setNewComment: false
}

export const commentsSlice = createSlice({
    name: 'comments', initialState,
    reducers: {
        cleanUpComments: (state) => {
            state.comments = [];
            state.page = 1;
            state.numberOfComments = 0;
            state.completed = false;
            state.setNewComment = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchComments.pending, state => {
            if (state.page < 2)
                state.completed = false;
        })
        builder.addCase(fetchComments.fulfilled, (state, action) => {
            state.comments = [...state.comments, ...action.payload.comments];
            if (!state.numberOfComments)
                state.numberOfComments = action.payload.numberOfComments
            state.page += 1;
            state.error = '';
            state.completed = true;
        })
        builder.addCase(fetchComments.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })

        builder.addCase(addNewComment.pending, state => {
            state.completed = false;
        })

        builder.addCase(addNewComment.fulfilled, (state, action) => {
            state.completed = true;
            state.comments = [];
            state.page = 1;
            state.numberOfComments = 0;
            state.setNewComment = true;
        })
        builder.addCase(addNewComment.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })

        builder.addCase(deleteComment.pending, state => {
            state.completed = false;
        })

        builder.addCase(deleteComment.fulfilled, (state, action) => {
            state.completed = true;
            state.comments = [];
            state.page = 1;
            state.numberOfComments = 0;
            state.completed = false;
            state.setNewComment = true;
        })
        builder.addCase(deleteComment.rejected, (state, action) => {
            state.completed = true;
            console.error(action.error)
            state.error = action.error.message;
        })
    }
})

export const {cleanUpComments} = commentsSlice.actions;