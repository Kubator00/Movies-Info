import React from "react";

const Error = (props) => {
    const {error} = props;
    return (
        <div className={'loading'} style={{minHeight:"300px"}}>
            {error}
        </div>
    )
}

export default Error;