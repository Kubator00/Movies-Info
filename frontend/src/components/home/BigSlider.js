import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import './BigSlider.css';
import {useDispatch, useSelector} from "react-redux";
import Loading from "../Lodaing";
import Error from "../Error";
import {fetchPremieres} from "../../reducers/production/upcomingPremieresReducer";
import { serverImages} from "../../api";
import Slider from "react-slick";

const Card = (props) => {
    const {name, directoryName} = props.production;
    const link = encodeURI(`/movie?name=${name}`);
    return <Link to={link} className={'bigSlider__card'}>
        <div className={'home__bigSliderImgContainer'}>
            <img src={`${serverImages}/productions/${directoryName}/poster.jpg`} alt={'info poster'}/>
        </div>
        <p>
            {name}
        </p>
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

const settingsSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <SampleNextArrow/>,
    prevArrow: <SamplePrevArrow/>,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 1100,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 850,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        },
    ]
};

export default function BigSlider() {
    const data = useSelector(state => state.upcomingPremieres.data);
    const completed = useSelector(state => state.upcomingPremieres.completed);
    const error = useSelector(state => state.upcomingPremieres.error);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPremieres());
    }, [dispatch])


    if (!completed)
        return <Loading/>
    if (error)
        return <Error error={error}/>

    return (
        <div className={'bigSlider'}>
            <Slider {...settingsSlider}>
                {data.map((m, i) => {
                    return <Card {...m} key={i}/>
                })}
            </Slider>
        </div>
    )
}

