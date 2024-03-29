import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverGraphQl } from "../../api";
import { gql, request } from "graphql-request";

export const fetchComments = createAsyncThunk('comments/fetch',
    async (props) => {
        const { page, pageSize, productionId } = props;

        const query = gql`
            query Query($productionId: String,  $page: Int, $pageSize: Int) {
                numberOfComments(productionId: $productionId)
                commentList(productionId:$productionId, page:$page, pageSize:$pageSize)
                {
                    _id,
                    content,
                    date,
                    user {
                        login
                        _id
                    }
                }
            }`;

        const variables = {
            productionId,
            pageSize,
            page
        }

        return await request(serverGraphQl, query, variables).then((data) => data);
    });

export const addNewComment = createAsyncThunk('comments/add',
    async (props) => {
        const { productionId, content } = props;
        const query = gql`
            mutation Mutation($productionId: String, $userToken: String, $userEmail: String, $content: String){
                addComment(
                productionId: $productionId,
                 userToken: $userToken, 
                 userEmail: $userEmail,
                 content: $content)
            }`

        const variables = {
            productionId,
            content,
            userToken: localStorage.getItem('token'),
            userEmail: localStorage.getItem('email'),
        }

        return await request(serverGraphQl, query, variables).then((data) => data);
    });


export const deleteComment = createAsyncThunk('comments/delete',
    async (props) => {
        const { id } = props;
        const query = gql`
            mutation DeleteComment($commentId: String, $userToken: String, $userEmail: String) {
               deleteComment(
                commentId: $commentId,
                userToken: $userToken, 
                userEmail: $userEmail)
            }`;

        const variables = {
            commentId: id,
            userToken: localStorage.getItem('token'),
            userEmail: localStorage.getItem('email'),
        }

        return await request(serverGraphQl, query, variables).then((data) => data);
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
            state.comments = [...state.comments, ...action.payload.commentList];
            if (!state.numberOfComments)
                state.numberOfComments = action.payload.numberOfComments;
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

export const { cleanUpComments } = commentsSlice.actions;