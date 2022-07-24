import React, {useEffect, useState} from "react";
import './Navbar.css'
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setLoginPopUp, setSearchScreen} from "../../reducers/styleReducer";
import {logout} from "../../reducers/userReducer";

const Search = () => {
    const dispatch = useDispatch();
    return (
        <div className={'navbar__search'}>
            <input type={'text'} onFocus={() => {
                dispatch(setSearchScreen(true))
            }}/>
            <Link className={'navbar__searchBTN'} to={'/'}>
                <img src={'./icons/search.svg'} alt={'search'}/>
            </Link>
        </div>
    )
}

const Menu = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [mobileMenuIsActive, setMobileMenuIsActive] = useState(false);
    const [userMenuIsActive, setUserMenuIsActive] = useState(false);

    useEffect(() => {
        if (userMenuIsActive && !user.isLogin)
            setUserMenuIsActive(false);
    }, [user, userMenuIsActive])

    return (
        <div className={'navbar__menu'}>
            <img src={mobileMenuIsActive ? './icons/cross.svg' : './icons/menu-burger.svg'} alt={'menu'}
                 className={'navbar__menuIcon'} onClick={() => {
                setMobileMenuIsActive(!mobileMenuIsActive)
            }}/>
            <ul className={mobileMenuIsActive ? 'navbar__menuList navbar__menuList--active' : 'navbar__menuList'}>
                <li>
                    <Link to={'/movie/list'} className={'navbar__menuListItem'}>
                        Movies
                    </Link>
                </li>
                <li>
                    <Link to={'/series/list'} className={'navbar__menuListItem'}>
                        Series
                    </Link></li>
                <li>
                    {user.isLogin ?
                        <div className={'navbar__menuLoginContainer'}>
                            <img src='./icons/portrait.svg' className={'navbar__menuUserIcon'}/>
                            {user.login}
                            <img src='./icons/angle-small-down.svg' className={'navbar__menuArrowIcon'} onClick={() => {
                                setUserMenuIsActive(!userMenuIsActive)
                            }}/>
                            {userMenuIsActive &&
                                <ul className={'navbar__menuLogin'}>
                                    <li>
                                        <Link to={''} className={'navbar__menuLoginLink'}>
                                            <img src={'./icons/settings.svg'} alt={'logout icon'}
                                                 className={'navbar__menuLoginIcon'}/>
                                            <label>Settings</label>
                                        </Link>
                                    </li>

                                    <li onClick={() => {
                                        dispatch(logout())
                                    }}>
                                        <Link to={''} className={'navbar__menuLoginLink'}>
                                            <img src={'./icons/logout.svg'} alt={'logout icon'}
                                                 className={'navbar__menuLoginIcon'}/>
                                            <label>LogOut</label>
                                        </Link>
                                    </li>
                                </ul>
                            }
                        </div>
                        :
                        <li>
                            <label onClick={() => {
                                dispatch(setLoginPopUp(true));
                            }} className={'navbar__menuListItem'}>
                                Sign In
                            </label>
                        </li>
                    }
                </li>
            </ul>
        </div>
    )
}

export default function Navbar() {
    const opacity = useSelector(state => state.navbarStyle.opacity);
    return (
        <div className={opacity ? 'navbarContainer' : 'navbarContainer navbarContainer--noOpacity'}>
            <div className={'navbar'}>
                <Link to={'/'} className={'navbar__logo'}>
                    <img src={'./Logo_Movies-Info.png'} alt={'logo'}/>
                </Link>
                <Search/>
                <Menu/>
            </div>
        </div>
    )
}