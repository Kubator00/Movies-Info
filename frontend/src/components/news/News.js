import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchNews} from "../../reducers/news/newsContentReducer";
import {useSearchParams} from "react-router-dom";
import Loading from "../Lodaing";
import Error from "../Error";
import './News.css'
import SmallSlider from "../home/SmallSlider";
import {serverImages} from "../../api";

export default function News() {
    const [params] = useSearchParams();
    const {name, htmlContent, backgroundImg, _id: id, author, date} = useSelector(state => state.newsContent.data);
    const completed = useSelector(state => state.newsContent.completed);
    const error = useSelector(state => state.newsContent.error);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchNews({id: params.get('id')}));
    }, [dispatch, params])

    if (!completed)
        return <Loading/>

    if (error)
        return <Error error={error}/>

    return (
        <div className={'news'}>
            <h1>{name}</h1>
            <div className={'news__secondHeader'}>
                <div className={'news__author'}>Author: {author}</div>
                <div>{new Date(parseInt(date)).toLocaleString('en-En')}</div>
            </div>
            {backgroundImg && <img src={`${serverImages}/news/${id}/${backgroundImg}`}
                                   alt={'background'}/>}
            <div className={'news__content'} dangerouslySetInnerHTML={{__html: htmlContent}}/>

            <div className={'news__smallSlider'}>
                <h2>News</h2>
                <SmallSlider containerClassName={'news__smallSliderContainer'}/>
            </div>
        </div>
    );
}