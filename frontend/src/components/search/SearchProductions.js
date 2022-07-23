import React, {useEffect} from "react";
import './SearchProductions.css'
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setSearchScreen} from "../../reducers/styleReducer";
import {
    fetchSearchProductions,
    fetchRecommendedProductions,
    cleanUpSearchProductions,
    setKeyword
} from "../../reducers/production/searchProductionsReducer";
import {serverImages} from "../../api";
import Loading from "../Lodaing";

const ProductionCard = (props) => {
    const {directoryName, name, category} = props;
    const dispatch = useDispatch();
    return (
        <Link to={`/${category}?name=${encodeURI(name)}`} onClick={() => {
            dispatch(setSearchScreen(false))
        }} className={'search__recommendedLink'}>
            <img src={`${serverImages}/productions/${directoryName}/poster.jpg`}
                 className={'search__recommendedImg'}/>
        </Link>
    );
}

export default function SearchProductions() {
    const dispatch = useDispatch();
    const {
        recommendedProductions,
        foundProductions,
        completed,
        numberOfResult,
        keyword
    } = useSelector(state => state.searchProductions);
    useEffect(() => {
        if (recommendedProductions.length < 1)
            dispatch(fetchRecommendedProductions({limit: 8}));
    }, []);


    const keywordHandler = (e) => {
        dispatch(setKeyword({keyword: e.target.value}));
        if (e.target.value) {
            dispatch(fetchSearchProductions({keyword: e.target.value}));
            return;
        }
        dispatch(cleanUpSearchProductions());
    }

    return (
        <div className={'searchContainer'}>
            <div className={'search'}>
                <div className={'search__header'}>
                    <label> Search for movies and series: </label>
                    <img src={'./icons/crossBlack.svg'} className={'search__crossImg'} alt={'cross'} onClick={() => {
                        dispatch(setSearchScreen(false))
                    }}/>
                </div>

                <div className={'search__main'}>
                    <input value={keyword} onChange={keywordHandler} type={'text'} placeholder={'Search...'}
                           className={'search__input'}/>
                </div>

                <div className={'search__recommendedContainer'}>
                    {!numberOfResult && keyword && completed &&
                        <label style={{color: 'red'}}> Results not found </label>}
                    <br/> <br/>
                    {!numberOfResult ? <label>See also </label> : <label>Results: </label>}
                    <div className={'search__recommended'}>
                        {!numberOfResult ?
                            recommendedProductions.map((p, i) => {
                                return <ProductionCard {...p} key={i}/>
                            })
                            :
                            foundProductions.map((p, i) => {
                                return <ProductionCard {...p} key={i}/>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}