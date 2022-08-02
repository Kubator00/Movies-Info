import React, {useEffect} from "react";
import {
    fetchRecommendedProductions,
    cleanUpRecommendedProduction
} from "../../reducers/production/recommendedProduction";
import './ReccomendedProduction.css'
import {useDispatch, useSelector} from "react-redux";
import Loading from "../Loading";
import Error from "../Error";
import {serverImages} from "../../api";
import {Link} from "react-router-dom";

const ProductionCard = (props) => {
    const {directoryName, name,category} = props.props;
    return (
        <div className={'production__recommendedCard'}>
        <Link to={`/${category}?name=${encodeURI(name)}`} className={'production__recommendedCardLink'}>
            <img src={`${serverImages}/productions/${directoryName}/poster.jpg`}
                 className={'production__recommendedImg'} alt={'recommended product poster'}/>
        </Link>
        </div>
    )
}

export default function RecommendedProductions(props) {
    const {productionId} = props;
    const {data, completed, error} = useSelector(state => state.recommendedProductions);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchRecommendedProductions({productionId: productionId}));
        return (() => {
            dispatch(cleanUpRecommendedProduction());
        })
    }, []);

    if (!completed)
        return <Loading/>
    if (error)
        return <Error error={error}/>

    return (
        <div className={'production__recommendedContainer'}>
            <h2>See also</h2>
            <div className={'production_recommended'}>
                {data.map((production, i) => {
                    return <ProductionCard props={production} key={i}/>
                })}
            </div>
        </div>
    );
}