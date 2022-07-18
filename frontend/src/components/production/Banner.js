import React from "react";
import {serverImages} from "../../api";


export default function ProductionBanner(props) {
    const {directoryName, duration, category, name, rating, releaseDate} = props;
    return (
        <div className={'production__bannerBackground'}>
            <div className={'production__bannerContainer'}>
                <img
                    src={`${serverImages}/productions/${directoryName}/background.jpg`}
                    alt={'banner'}
                    className={'production__banner'}/>
                <div className={'production__bannerInfo'}>
                    <h2 className={'production__bannerCategory'}>{category}</h2>
                    <h1 className={'production__bannerTitle'}>{name}</h1>
                    <h3 className={'production__bannerDuration'}>{releaseDate.getFullYear()}
                        {duration?.hours && ` ${duration.hours}h`} {duration?.minutes && `${duration.minutes}min`}</h3>
                </div>
                <div className={'production__rating'}>
                    <img src={`./icons/star.svg`} className={'production__starImg'} alt={'star'}/>
                    <div className={'production__ratingRate'}>{rating?.rate.toPrecision(2)}</div>
                    <div
                        className={'production__ratingNumberOfRate'}>    {Intl.NumberFormat('en', {notation: 'compact'}).format(rating?.numberOfRates)} rates
                    </div>
                </div>
            </div>
        </div>
    );
}