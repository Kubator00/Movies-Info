import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

export default function ProtectedRoute(props) {
    const {isLogin} = useSelector(state => state.user);
    if (isLogin)
        return <Outlet/>;
    return <Navigate to={'/'}/>

}