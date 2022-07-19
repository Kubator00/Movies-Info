import './PageButtons.css'
import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from "react-router-dom";

const PageButtons = (props) => {
    const {numberOfRows, page, pageSize,restUrl} = props.props;
    const [lastNumber, setLastNumber] = useState(Math.ceil(numberOfRows / pageSize));
    const [inputNumber, setInputNumber] = useState(1);

    useEffect(() => {
        setLastNumber(Math.ceil(numberOfRows / pageSize));
    }, [pageSize, numberOfRows])


    const inputHandler = (event) => {
        setInputNumber(parseInt(event.target.value, 10));
    }
    const navigate = useNavigate();
    const inputKeyDownHandler = (event) => {
        if (inputNumber > lastNumber || inputNumber < 1 || inputNumber === page)
            return;
        if (event.key === 'Enter')
            navigate(`?page=${inputNumber}${restUrl}`)
    }

    return (
        <div class='pagebuttons-container'>
            <div class='pagebuttons'>

                {
                    (lastNumber > 1 && page !== 1) &&
                    <Link to={`?page=${page - 1}${restUrl}`}>
                        <img src='./icons/angle-left.svg' class='pagebuttons-nextbutton' alt='left arrow'/>
                    </Link>
                }

                <Link exact to={`?page=1`}
                      class={page === 1 ? 'pagebuttons-current-button' : 'pagebuttons-button'}>
                    1
                </Link>

                {
                    (page - 1 > 1) &&
                    <Link to={`?page=${page - 1}${restUrl}`} class='pagebuttons-button'>
                        {page - 1}
                    </Link>
                }

                {
                    (page !== 1 && page !== lastNumber) &&
                    <Link to={`?page=${page}${restUrl}`}
                          class={(page != 1 && page != lastNumber) ? 'pagebuttons-current-button' : 'pagebuttons-button'}>
                        {page}
                    </Link>
                }
                {
                    (page + 1 < lastNumber) &&
                    <Link to={`?page=${page + 1}${restUrl}`} class='pagebuttons-button'>
                        {page + 1}
                    </Link>
                }
                {(lastNumber > 2) &&
                    <input type='number' className='pagebuttons-input' onChange={inputHandler}
                           onKeyDown={inputKeyDownHandler}/>
                }
                {
                    (lastNumber > 1) &&

                    <Link to={`?page=${lastNumber}${restUrl}`}
                          class={page === lastNumber ? 'pagebuttons-current-button' : 'pagebuttons-button'}>
                        {lastNumber}
                    </Link>
                }{
                (lastNumber > 1 && page !== lastNumber) &&
                <Link to={`?page=${page + 1}${restUrl}`}>
                    <img src='./icons/angle-right.svg' className='pagebuttons-nextbutton'
                         alt='right arrow'/>
                </Link>

            }
            </div>
        </div>
    );
}

export default PageButtons;