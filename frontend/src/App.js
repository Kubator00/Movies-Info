import {BrowserRouter, Routes, Route, useLocation, Outlet} from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import ProductionInfo from "./components/production/info/ProductionInfo";
import News from "./components/news/News";
import {setNavbarOpacity, setUserMenu} from './reducers/styleReducer'
import {useDispatch, useSelector} from "react-redux";
import {useLayoutEffect} from "react";
import Login from "./components/login/Login";
import MovieList from "./components/production/list/MovieList";
import SeriesList from "./components/production/list/SeriesList";
import SearchProductions from "./components/search/SearchProductions";
import AccountSettings from "./components/user/Settings";
import Footer from "./components/footer/Footer";

const IsHomePage = ({value}) => {
    const dispatch = useDispatch();
    dispatch(setNavbarOpacity(value));
    return <Outlet/>
}

const Wrapper = ({children}) => {
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children
}


function App() {
    const dispatch = useDispatch();
    const popUp = useSelector(state => state.navbarStyle.signUpPopUp);
    const searchScreen = useSelector(state => state.navbarStyle.searchScreen);
    return (
        <>
            <BrowserRouter>
                {popUp && <Login/>}
                {searchScreen && <SearchProductions/>}
                <Wrapper>
                    <Navbar/>
                    <div onClick={() => {
                        dispatch(setUserMenu(false))
                    }} style={{width: '100%', display: "flex",flexDirection:'column', alignItems: 'center'}}>
                        <Routes>
                            <Route path='' element={<IsHomePage value={true}/>}>
                                <Route path='/' element={<Home/>}/>
                            </Route>

                            <Route path='' element={<IsHomePage value={false}/>}>
                                <Route path='/movie/list' exact element={<MovieList/>}/>
                                <Route path='/series/list' exact element={<SeriesList/>}/>
                                <Route path='/movie' exact element={<ProductionInfo/>}/>
                                <Route path='/series' exact element={<ProductionInfo/>}/>
                                <Route path='/news' exact element={<News/>}/>
                                <Route path='/settings' exact element={<AccountSettings/>}/>
                            </Route>
                        </Routes>
                        <Footer/>
                    </div>
                </Wrapper>
            </BrowserRouter>
        </>
    )
        ;
}

export default App;
