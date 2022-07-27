import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchProductionUserRating,
    setProductionUserRating
} from "../../reducers/production/productionUserRaitingReducer";
import {setLoginPopUp} from "../../reducers/styleReducer";
import Error from "../Error";

const initStars = [
    'star_gray.svg',
    'star_gray.svg',
    'star_gray.svg',
    'star_gray.svg',
    'star_gray.svg',
    'star_gray.svg',
    'star_gray.svg',
    'star_gray.svg',
    'star_gray.svg',
    'star_gray.svg'

]

export default function ProductionRating(props) {
    const {id} = props;
    const [stars, setStars] = useState(initStars);
    const {rating: userRate, completed, error} = useSelector(state => state.movieUserRating);
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem("isLogin"))
            dispatch(fetchProductionUserRating({id: id}))
    }, [dispatch, id]);

    useEffect(() => {
        setStars(starsSetHandler(userRate));
    }, [userRate])

    const starsSetHandler = (rate) => {
        let stars = [...initStars];
        for (let i in stars) {
            if (i >= rate)
                break;
            stars[i] = 'star.svg'
        }
        return stars;
    }

    const starsEnterHandler = (e) => {
        setStars(starsSetHandler(e.target.id + 1));
    }

    const starsLeaveHandler = () => {
        if (userRate)
            setStars(starsSetHandler(userRate));
        else
            setStars(starsSetHandler(0));
    }

    const starsClickHandler = (e) => {
        if (!localStorage.getItem('isLogin')) {
            return dispatch(setLoginPopUp(true));
        }
        dispatch(setProductionUserRating({rating: parseInt(e.target.id) + 1, id: id}));
    }

    if (error)
        return <Error error={error}/>

    return (
        <div className={'production__userRating'}>
            <h3> Your rating </h3>
            <div className={'production__userRatingStars'}>
                {stars.map((star, i) =>
                    <img id={i.toString()} src={`./icons/${star}`} className={'production__userRatingStarImg'}
                         alt={'star'} key={i}
                         onMouseEnter={starsEnterHandler} onMouseLeave={starsLeaveHandler} onClick={starsClickHandler}/>
                )}
            </div>
        </div>
    )
}