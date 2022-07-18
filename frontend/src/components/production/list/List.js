import React, {useState} from "react";
import './List.css'
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import PageButtons from "../../pageButtons/PageButtons";
import {useSearchParams, useNavigate, Link} from "react-router-dom";
import Loading from "../../Lodaing";
import Error from "../../Error";
import {serverImages} from "../../../api";
import {fetchProductionList} from "../../../reducers/production/productionListReducer";

const Card = (props) => {
    const {name, directoryName, releaseDate: releaseDateString, rating,category} = props.movie;
    return (
        <Link to={`/${category}?name=${encodeURI(name)}`} className={'productionList__card'}>
            <div className={'productionList__cardRightSide'}>
                <div className={'productionList__cardImg'}>
                    <img src={`${serverImages}/productions/${directoryName}/poster.jpg`} alt={'info poster'}/>
                </div>
                <div className={'productionList__info'}>
                    <h2>{name}</h2>
                    {new Date(releaseDateString).getFullYear()}
                </div>
            </div>
            <div className={'productionList__cardLeftSide'}>
                <div className={'productionList__cardRating'}>
                    <div className={'productionList__cardRate'}>
                        <img src={'./icons/star.svg'} alt={'star'} className={'productionList__starImg'}/>
                        {rating?.rate.toPrecision(2)}
                    </div>
                    {Intl.NumberFormat('en', {notation: 'compact'}).format(rating?.numberOfRates)} rates
                </div>
            </div>
        </Link>
    );
}
const SortButton = () => {
    const [sortButtonActive, setSortButtonActive] = useState(false);
    const types = [
        {name: 'rating', orderBy: ['ascending', 'descending']},
        {name: 'number of rating', orderBy: ['lowest', 'highest']},
        {name: 'release date', orderBy: ['oldest', 'newest']}];
    const [params] = useSearchParams();
    const [currentSort] = useState({
        name: types.find(element => element.name === params.get('orderBy')) ? params.get('orderBy') : types[0].name,
        orderBy: params.get('descending') === 'true' ? true : params.get('descending') !== 'false'
    });

    return (
        <div className={'productionList__sort'}>
            <button className={'productionList__sortBtn'} onClick={() => {
                setSortButtonActive(!sortButtonActive)
            }}>
                <div className={'productionList__sortBtnInfo'}>
                    <div className={'productionList__sortName'}
                         style={{marginLeft: '0', marginRight: '5px'}}> {currentSort.name}:
                    </div>
                    <b>
                        {currentSort.orderBy ? types[types.findIndex((el) => {
                            return el.name === currentSort.name
                        })].orderBy[1] : types[types.findIndex((el) => {
                            return el.name === currentSort.name
                        })].orderBy[0]}</b>
                </div>
                <img src={'./icons/angle-down.svg'} alt='down-arrow' className={'productionList__sortBtnArrow'}/>
            </button>
            {sortButtonActive &&
                <ul className={'productionList__sortMenu'}>
                    {
                        types.map((type, i, rows) => {
                            return (
                                <li className={i + 1 !== rows.length ? 'productionList__sortMenuItem' : 'productionList__sortMenuItem productionList__sortMenuItem--lastItem'} key={i}>
                                    <div className={'productionList__sortName'}>
                                        {type.name}:
                                    </div>
                                    <ul className={'productionList__sortTypes'}>
                                        {type.orderBy.map((a, j) => {
                                            return (
                                                <li>
                                                    <Link
                                                        to={`${encodeURI(`?page=1&orderBy=${type.name}&descending=${j === 1 ? 'true' : 'false'}`)}`}>
                                                        {a}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </div>
    );
}

export default function List(props) {
    const {obj, title, category} = props;
    const [params] = useSearchParams();
    const page = parseInt(params.get('page'));
    const orderBy = params.get('orderBy');
    const descending = params.get('descending');
    const navigate = useNavigate();
    if (!page || !orderBy || !descending)
        navigate(`?page=1&orderBy=rating&descending=true`);
    const {data, numberOfRows, completed, error} = obj;
    const pageSize = 4;


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchProductionList({page: page, pageSize: pageSize, orderBy: orderBy, descending: descending,category:category}));
    }, [descending, dispatch,  orderBy, page, params])

    if (!completed)
        return <Loading/>

    if (error)
        return <Error error={error}/>

    return (
        <div className={'productionList'}>
            <h1>{title}</h1>
            <SortButton/>
            <div className={'movieList__list'}>
                {data.map((movie, i) => {
                    return <Card movie={movie} key={i} />
                })}
            </div>
            <PageButtons props={{
                numberOfRows: numberOfRows,
                page: page,
                pageSize: pageSize,
                restUrl: `&orderBy=${orderBy}&descending=${descending}`
            }}/>
        </div>
    );
}