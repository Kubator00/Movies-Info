import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import './BigSlider.css';
import {useDispatch, useSelector} from "react-redux";
import Loading from "../Lodaing";
import Error from "../Error";
import {fetchPremieres} from "../../reducers/production/upcomingPremieresReducer";
import { serverImages} from "../../api";

const Card = (props) => {
    const {name, directoryName} = props.props;
    const link = encodeURI(`/movie?name=${name}`);
    return <Link to={link} className={'home__bigSliderCard'}>
        <div className={'home__bigSliderImg'}>
            <img src={`${serverImages}/productions/${directoryName}/poster.jpg`} alt={'info poster'}/>
        </div>
        <p>
            {name}
        </p>
    </Link>
}

export default function SmallSlider() {
    const data = useSelector(state => state.upcomingPremieres.data);
    const completed = useSelector(state => state.upcomingPremieres.completed);
    const error = useSelector(state => state.upcomingPremieres.error);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPremieres());
    }, [dispatch])


    const [style, setStyle] = useState();
    const [counter, setCounter] = useState(0);
    const [leftIsEnd, setLeftIsEnd] = useState(true);
    const [rightIsEnd, setRightIsEnd] = useState(false);
    const homeSliderDiv = useRef();
    const homeSliderContentDiv = useRef();
    let MOVE_SIZE = 50;


    const moveRight = () => {
        if (rightIsEnd)
            return
        if (leftIsEnd)
            setLeftIsEnd(false);
        let i = 0;
        while (i < MOVE_SIZE) {
            i++;
            if (homeSliderDiv.current.clientWidth <= homeSliderContentDiv.current.clientWidth + (homeSliderDiv.current.clientWidth * (counter + i) / 100)) {
                setRightIsEnd(true);
                break;
            }
        }
        setStyle({transform: `translateX(calc(-${counter + i}%)`});
        setCounter(counter + i);
    }

    const moveLeft = () => {
        if (rightIsEnd)
            setRightIsEnd(false);
        if (counter - MOVE_SIZE <= 0) {
            setCounter(0);
            setLeftIsEnd(true);
            setStyle({transform: `none`});
        } else {
            setStyle({transform: `translateX(calc(-${counter - MOVE_SIZE}%))`});
            setCounter(counter - MOVE_SIZE);
        }
    }


    if (!completed)
        return <Loading/>
    if (error)
        return <Error error={error}/>

    return (
        <div className={'home__bigSliderContainer'}>
            <div className={'home__bigSliderContent'} ref={homeSliderContentDiv}>
                <div className={'home__bigSlider'} style={style} ref={homeSliderDiv}>
                    {data.map((data, i) => {
                        return <Card props={data} key={i}/>
                    })}
                </div>
            </div>
            <div
                className={leftIsEnd ? 'home__bigSliderArrow--hidden' : 'home__bigSliderArrow home__bigSliderArrow--left'}>
                <img src={'./icons/angle-small-left.svg'} alt={'left arrow'}
                     onClick={() => {
                         moveLeft(true)
                     }}/>
            </div>
            <div
                className={rightIsEnd ? 'home__bigSliderArrow--hidden' : 'home__bigSliderArrow home__bigSliderArrow--right'}>
                <img src={'./icons/angle-small-right.svg'} alt={'right arrow'}
                     onClick={() => {
                         moveRight(true)
                     }}/>
            </div>
        </div>
    )
}

