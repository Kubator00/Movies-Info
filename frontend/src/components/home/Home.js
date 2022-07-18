import React, {useEffect, useRef, useState} from "react";
import './Home.css'
import SmallSlider from "./SmallSlider";
import BigSlider from "./BigSlider";
import {useDispatch, useSelector} from "react-redux";
import {fetchBanners} from "../../reducers/production/bannersReducer";
import Loading from "../Lodaing";
import Error from "../Error";
import {serverImages} from "../../api";

const HomeBanner = () => {
    const {data, error, completed} = useSelector(state => state.banners);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch((fetchBanners()));
    }, [dispatch])
    const [currentBanner, setCurrentBanner] = useState(0);
    let intervalId = useRef();
    useEffect(() => {
        let interval = intervalId.current =
            setInterval(() => {
                moveBannerRight();
            }, 7000);

        return () => clearInterval(interval);
    });

    const moveBannerRight = (resetInterval) => {
        if (resetInterval)
            clearInterval(intervalId.current);
        setCurrentBanner(currentBanner >= data.length - 1 ? 0 : currentBanner + 1);
    }
    const moveBannerLeft = (resetInterval) => {
        if (resetInterval)
            clearInterval(intervalId.current);
        setCurrentBanner(currentBanner <= 0 ? data.length - 1 : currentBanner - 1);
    }
    if (!completed)
        return <Loading/>
    if (error)
        return <Error error={error}/>
    return (
        <div className={'home__banner'}>
            <div className={'home__bannerArrow'}>
                <img src={'./icons/angle-circle-left.svg'} alt={'left arrow'}
                     onClick={() => {
                         moveBannerLeft(true)
                     }}/>
            </div>
            <div className={'home__bannerArrow'}>
                <img src={'./icons/angle-circle-right.svg'} alt={'right arrow'}
                     onClick={() => {
                         moveBannerRight(true)
                     }}/>
            </div>
            {
                data.map((slide, i) => {
                    return <div key={i}
                                className={currentBanner === i ? 'home__bannerItem home__bannerItem--acitve' : 'home__bannerItem'}>
                        <img src={`${serverImages}/banners/${slide.banner}`} alt={'banner'}/>
                        <div className={'home__bannerInfo'}>
                            <h1>{slide.name}</h1>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default function Home() {


    return (
        <div className={'home'}>
            <HomeBanner/>
            <SmallSlider containerClassName='home__smallSliderContainer'/>
            <div className={'home__premiersContainer'}>
                <div className={'home__premiers'}>
                    <h2>Upcoming premiers</h2>
                    <BigSlider/>
                </div>
            </div>


        </div>
    )
}
