import Vue from 'vue'
import VueRouter from 'vue-router'

//引入组件
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import LayOutView from '../views/LayOut.vue'
import RegisterView from '../views/RegisterView.vue'
import HotelLayOut from '../views/HotelLayOut.vue'
import BookingView from '../views/BookingView.vue'
import HotelDetailView from '../views/HotelDetailView.vue'
import HistoryInfoView from '../views/HistoryInfoView.vue'

Vue.use(VueRouter)

const routes = [
    //重定向
    {
        path: '/',
        redirect: '/login'
    },
    //登录路由
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/user',
        name: 'HotelLayOut',
        meta: {
            title: '写成旅行',
            keepAlive: true, // 需要被缓存
        },
        component: HotelLayOut,
        children: [
            {
                path: '',
                name: 'BookingView',
                component: BookingView
            },
            {
                //path: 'hotel/:hotelID',//此实现方案暂时搁置，因为实在是搞不明白如何实现路径变化，算了路径不变化吧。
                path: 'hotel',
                name: 'HotelDetailView',
                component: HotelDetailView,
                // 路由把酒店传参，因为这个组件需要知道当前是哪个酒店
                // props:  route => ({ hotel: route.params.hotel})
                props: route => {
                    const hotel = route.params.hotel || JSON.parse(localStorage.getItem('currentHotel'));
                    return { hotel };
                }
            },
            {
                path: 'historybook',
                name: 'HistoryInfoView',
                component: HistoryInfoView
            }
        ]
    },

    {
        path: '/admin',
        name: 'LayOut',
        component: LayOutView,
        children: [
            {
                path: '',
                name: 'home',
                component: HomeView
            },
            {

                path: 'admin',
                name: 'admin',
                component: AdminView
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//配置路由守卫
router.beforeEach((to, from, next) => {
    //利用路由守卫设置网页标题
    window.document.title = to.meta.title == undefined ? '写成旅行' : to.meta.title
    //判断是否登录
    if (to.path == '/login' || to.path == '/register') {
        next();//若登录或注册 则放行
    }
    const user = localStorage.getItem('user');//获取本地存储的用户信息
    if (!user && to.path != '/login' && to.path != '/register') {
        return next('/login');
    }
    next();
})


export default router
