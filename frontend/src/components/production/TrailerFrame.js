import React from "react";

export default function TrailerFrame(props) {
    const {url} = props;
    return(
        <iframe src={url+'?autoplay=1&mute=1'} className={'production__ytFrame'}
                title="YouTube video player"
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen/>
    )
};