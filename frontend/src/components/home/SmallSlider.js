import React, {useEffect, useRef, useState} from "react";
import './SmallSlider.css';
import {useDispatch, useSelector} from "react-redux";
import Loading from "../Lodaing";
import Error from "../Error";
import {fetchLastNews} from "../../reducers/news/lastNewsReducer";
import {Link} from "react-router-dom";
import {serverImages} from "../../api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Card = (props) => {
    const {_id: id, img, name} = props;
    return <Link className={'smallSlider__card'} to={`/news?id=${id}`}>
        <div className={'smallSlider__imgContainer'}>
            <img src={`${serverImages}/news/${id}/${img}`} alt={'news'}/>
        </div>
        <div className={'smallSlider__name'}>
            {name}
        </div>
    </Link>
}

function SampleNextArrow(props) {
    const {className, style, onClick} = props;
    return (
        <div
            className={`${className} smallSlider__arrow`}
            style={{...style, background: 'orange'}}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const {className, style, onClick} = props;
    return (
        <div
            className={`${className} smallSlider__arrow`}
            style={{...style, background: 'orange'}}
            onClick={onClick}
        />
    );
}

const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <SampleNextArrow/>,
    prevArrow: <SamplePrevArrow/>,
    responsive: [
        {
            breakpoint: 1300,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 800,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        },
    ]
};

export default function SmallSlider(props) {

    const arr = useSelector(state => state.lastNews.data);
    const error = useSelector(state => state.lastNews.error);
    const completed = useSelector(state => state.lastNews.completed);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchLastNews());
    }, [dispatch])


    if (!completed)
        return <Loading/>
    if (error)
        return <Error/>

    return (
        <div className={props.containerClassName}>
            <Slider {...sliderSettings}>
                {arr.map((news, i) => {
                    return <Card {...news} key={i}/>
                })}
            </Slider>
        </div>
    )
}

