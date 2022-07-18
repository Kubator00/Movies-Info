import {configureStore} from '@reduxjs/toolkit'
import {productionInfoSlice} from './reducers/production/productionInfoReducer'
import {upcomingPremieresSlice} from "./reducers/production/upcomingPremieresReducer";
import {newsContentSlice} from "./reducers/newsContentReducer";
import {lastNewsSlice} from "./reducers/lastNewsReducer";
import {styleSlice} from "./reducers/styleReducer";
import {productionListSlice} from "./reducers/production/productionListReducer";
import {bannersSlice} from "./reducers/production/bannersReducer";
import {userSlice} from "./reducers/user/loginReducer";
import {productionUserRatingSlice} from "./reducers/production/productionUserRaitingReducer";
import {commentsSlice} from "./reducers/production/commentsReducer";
import {recommendedProductionsSlice} from "./reducers/production/recommendedProduction";
import {searchProductionsSlice} from "./reducers/production/searchProductionsReducer";


export default configureStore({
    reducer: {
        movieInfo: productionInfoSlice.reducer,
        upcomingPremieres: upcomingPremieresSlice.reducer,
        newsContent: newsContentSlice.reducer,
        lastNews: lastNewsSlice.reducer,
        navbarStyle: styleSlice.reducer,
        productionList: productionListSlice.reducer,
        banners: bannersSlice.reducer,
        user: userSlice.reducer,
        movieUserRating: productionUserRatingSlice.reducer,
        comments: commentsSlice.reducer,
        recommendedProductions: recommendedProductionsSlice.reducer,
        searchProductions: searchProductionsSlice.reducer
    },
})