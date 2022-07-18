export const server = 'http://localhost:3010';
export const serverFiles = 'http://localhost:3010/public/';
export const serverImages = 'http://localhost:3010/public/img';

export default {
    production:{
        premieres: server + '/production/upcomingpremieres',
        banners: server+'/production/banners',
        userRating: server+'/production/rating',
        info: server + '/production/details',
        list: server+'/production/list',
        recommended: server+'/production/recommended',
        search: server+'/production/search',
        comment:{
            add: server+'/production/comment/add',
            get: server+'/production/comment',
            delete: server+'/production/comment',
        },
    },
    news: {
        last: server + '/news/last',
        content: server + '/news/content'
    },
    user: {
        login: server + '/user/login',
        register: server + '/user/register'
    }
}