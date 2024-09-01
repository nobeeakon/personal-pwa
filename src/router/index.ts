import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from '../pages/HelloWorld.vue'
import ShopList from '../pages/shop-list-page/ListPage.vue'
import TimelinePage from '../pages/timeline/Timeline.vue'
import Sums from '../pages/sums/Sums.vue'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path:"/",
            name: 'home',
            component: HomePage
        },
    {
        path:'/shop',
        name: 'shop',
        component: ShopList
    },
    {path: '/timeline',
    name: 'timeline',
    component: TimelinePage
    }, {
        path: '/sums',
        name: 'sums',
        component: Sums,
    }
    ]
})


export default router;