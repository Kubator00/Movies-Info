import React, {useEffect, useState} from 'react';
import {cleanUpComments, fetchComments, addNewComment, deleteComment} from "../../reducers/production/commentsReducer";
import {useDispatch, useSelector} from "react-redux";
import './Comment.css'
import Loading from "../Lodaing";
import Error from "../Error";

const Card = (props) => {
    const {user, content, date, _id: id} = props;
    const {login: userLogin, _id: userId} = user;
    const dispatch = useDispatch();
    return (
        <div className={'comment'}>
            <div className={'comment__imgHeader'}>
                <img src={'./icons/portrait.svg'} alt={'user image'} className={'comment__userImg'}/>
                {localStorage.getItem('login') === userLogin &&
                    <div style={{color: 'blue', cursor: 'pointer'}} onClick={() => {
                        dispatch(deleteComment({id: id}))
                    }}>delete</div>}
            </div>
            <div className={'comment__content'}>
                <div className={'comment__contentHeader'}>
                    <h3>{userLogin}</h3>
                    {new Date(parseInt(date)).toLocaleString('en-En')}
                </div>
                {content}
            </div>
        </div>
    )
}

export default function Comments(props) {
    const {productionId} = props;
    const {
        comments,
        completed,
        error,
        page,
        pageSize,
        numberOfComments,
        setNewComment
    } = useSelector(state => state.comments);
    const dispatch = useDispatch();
    const [newCommentContent, setNewCommentContent] = useState('');


    useEffect(() => {
        dispatch(fetchComments({page: page, pageSize: pageSize, productionId: productionId}));
        return () => {
            dispatch(cleanUpComments());
        };
    }, []);

    useEffect(() => {
        if (setNewComment) {
            dispatch(cleanUpComments());
            dispatch(fetchComments({page: page, pageSize: pageSize, productionId: productionId}));
        }
    }, [setNewComment])

    const getComments = () => {
        dispatch(fetchComments({page: page, pageSize: pageSize, productionId: productionId}))
    }

    const addComment = () => {
        dispatch(addNewComment({productionId: productionId, content: newCommentContent}));
        setNewCommentContent('');

    }
    const newCommentHandler = (e) => {
        setNewCommentContent(e.target.value);
    }

    if (!completed)
        return <Loading/>;
    if (error)
        return <Error error={error}/>

    return (

        <div className={'comments'}>
            <h2>Comments</h2>
            <div className={'comment_new'}>
                <h3>Add new comment</h3>
                <textarea className={'comment_newText'} onChange={newCommentHandler} value={newCommentContent}/>
                <button className={'comment_newBtn'} onClick={() => {
                    addComment()
                }}>Add
                </button>
            </div>
            {comments.length < 1 ?
                <div>There are no comments yet</div> :
                <div>
                    {comments.map((com, i) => {
                        return <Card {...com} key={i}/>
                    })}
                    <div className={'comments__seeMoreBtnContainer'}>
                        {numberOfComments > comments.length ?
                            <button onClick={() => {
                                getComments()
                            }} className={'comments_seeMoreBtn'}>
                                See more
                            </button> :
                            <span>
                            No more comments
                            </span>
                        }
                    </div>
                </div>}
        </div>

    )
}