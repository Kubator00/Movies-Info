import React from "react";
import List from "./List";
import {useSelector} from "react-redux";

export default function MovieList() {
    const obj = useSelector(state => state.productionList);
    return <List  obj={obj} title={'Movies List'} category={'movie'} />
}