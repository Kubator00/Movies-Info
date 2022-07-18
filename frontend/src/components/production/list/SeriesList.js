import React from "react";
import List from "./List";
import {useSelector} from "react-redux";

export default function SeriesList() {
    const obj = useSelector(state => state.productionList);
    return <List  obj={obj} title={'Series List'} category={'series'}/>
}