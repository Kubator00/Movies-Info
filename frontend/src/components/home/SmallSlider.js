import React, {useEffect, useRef, useState} from "react";
import './SmallSlider.css';
import {useDispatch, useSelector} from "react-redux";
import Loading from "../Lodaing";
import Error from "../Error";
import {fetchLastNews} from "../../reducers/lastNewsReducer";
import {Link} from "react-router-dom";
import {serverImages} from "../../api";

const Card = (props) => {
    const {_id: id, img, name} = props.props;
    return <Link className={'smallSliderCard'} to={`/news?id=${id}`}>
        <div className={'smallSliderImg'}>
            <img src={`${serverImages}/news/${id}/${img}`} alt={'a'}/>
        </div>
        <p>
            {name}
        </p>
    </Link>
}

export default function SmallSlider(props) {

    const arr = useSelector(state => state.lastNews.data);
    const error = useSelector(state => state.lastNews.error);
    const completed = useSelector(state => state.lastNews.completed);

    const [style, setStyle] = useState();
    const [counter, setCounter] = useState(0);
    const [leftIsEnd, setLeftIsEnd] = useState(true);
    const [rightIsEnd, setRightIsEnd] = useState(false);
    const homeSliderDiv = useRef();
    const homeSliderContainerDiv = useRef();
    let MOVE_SIZE = 50;
    const [lastX, setLastX] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchLastNews());
    }, [dispatch])

    const moveRight = () => {
        if (rightIsEnd)
            return
        if (leftIsEnd)
            setLeftIsEnd(false);
        let i = 0;
        while (i < MOVE_SIZE) {
            i++;
            if (homeSliderDiv.current.clientWidth <= homeSliderContainerDiv.current.clientWidth + (homeSliderDiv.current.clientWidth * (counter + i) / 100)) {
                setRightIsEnd(true);
                break;
            }
        }
        setStyle({transform: `translateX(calc(-${counter + i}%))`});
        setCounter(counter + i);
    }

    const moveLeft = () => {
        if (rightIsEnd)
            setRightIsEnd(false);
        if (counter - MOVE_SIZE <= 0) {
            setCounter(0);
            setLeftIsEnd(true);
            setStyle({transform: `none`});
        } else
            setStyle({transform: `translateX(calc(-${counter - MOVE_SIZE}%))`});
        if (counter !== 0)
            setCounter(counter - MOVE_SIZE);
    }

    const c = (e) => {
        MOVE_SIZE = 15;
        if (lastX > e.nativeEvent.clientX)
            moveLeft();
        else
            moveRight();
        MOVE_SIZE = 50;
        setLastX(e.nativeEvent.clientX);
    }
    if (!completed)
        return <Loading/>
    if (error)
        return <Error/>

    return (
        <div className={props.containerClassName} onTouchMove={c}>
            <div className={'smallSliderContent'} ref={homeSliderContainerDiv} onKeyDown={c}>
                <div className={'smallSlider'} style={style} ref={homeSliderDiv}>
                    {arr.map((data, i) => {
                        return <Card props={data} key={i}/>
                    })}
                </div>
            </div>
            <div
                className={leftIsEnd ? 'smallSliderArrow--hidden' : 'smallSliderArrow smallSliderArrow--left'}>
                <img src={'./icons/angle-small-left.svg'} alt={'left arrow'}
                     onClick={() => {
                         moveLeft(true)
                     }}/>
            </div>
            <div
                className={rightIsEnd ? 'smallSliderArrow--hidden' : 'smallSliderArrow smallSliderArrow--right'}>
                <img src={'./icons/angle-small-right.svg'} alt={'right arrow'}
                     onClick={() => {
                         moveRight(true)
                     }}/>
            </div>
        </div>
    )
}

