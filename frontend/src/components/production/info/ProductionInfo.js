import React, {useEffect, useState} from "react";
import './ProductionInfo.css'
import {useDispatch, useSelector} from "react-redux";
import {cleanUpInfo, fetchProduction} from "../../../reducers/production/productionInfoReducer";
import Loading from "../../Lodaing";
import Error from "../../Error";
import {useSearchParams} from "react-router-dom";
import ProductionRating from '../Rating'
import ProductionBanner from "../Banner";
import TrailerFrame from "../TrailerFrame";
import Comments from "../Comments";
import RecommendedProductions from "../RecommendedProductions";


export default function ProductionInfo() {
    const [searchParams] = useSearchParams();
    const [releaseDate, setReleaseDate] = useState(new Date());
    const {
        _id: id,
        name,
        releaseDate: releaseDateString,
        rating,
        directors,
        writers,
        mainStars,
        shortDescription,
        trailerUrl,
        duration,
        directoryName,
        category
    } = useSelector(state => state.movieInfo.data);


    const completed = useSelector(state => state.movieInfo.completed);
    const error = useSelector(state => state.movieInfo.error);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchProduction({movieName: searchParams.get('name')}));
        return (() => {
            dispatch(cleanUpInfo());
        })
    }, [searchParams])

    useEffect(() => {
        setReleaseDate(new Date(releaseDateString));
    }, [releaseDateString]);

    if (!completed)
        return <Loading/>
    if (error)
        return <Error error={error}/>

    return (
        <div className={'productionContainer'}>
            <div className={'production'}>
                <ProductionBanner name={name} duration={duration} releaseDate={releaseDate} category={category}
                                  directoryName={directoryName} rating={rating}/>
                <div className={'production__main'}>
                    <TrailerFrame url={trailerUrl}/>
                    <div className={'production__detailsTable'}>
                        <ProductionRating id={id}/>
                        <p className={'production__detailsTableItem'}>{shortDescription}.</p>
                        <p className={'production__detailsTableItem'}><b
                            className={'production__detailsTableItemKey'}>Release
                            date</b> {releaseDate.getUTCFullYear()}-{releaseDate.getUTCMonth() + 1}-{releaseDate.getUTCDate()}
                        </p>
                        <p className={'production__detailsTableItem'}><b
                            className={'production__detailsTableItemKey'}>Director</b> {directors}</p>
                        <p className={'production__detailsTableItem'}><b
                            className={'production__detailsTableItemKey'}>Writers</b> {writers}</p>
                        <p className={'production__detailsTableItem'}><b
                            className={'production__detailsTableItemKey'}>Stars</b> {mainStars}</p>
                    </div>
                </div>
            </div>
            <div className={'productionContainer productionContainer--comments'}>
                <div className={'production__second'}>
                    <Comments productionId={id}/>
                    <RecommendedProductions productionId={id} category={category}/>
                </div>
            </div>
</div>
)
}
