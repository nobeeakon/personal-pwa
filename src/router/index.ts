import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../pages/HelloWorld.vue'
import ShopList from '../pages/shop-list-page/ListPage.vue'
import TimelinePage from '../pages/timeline/Timeline.vue'

const router = createRouter({
    history: createWebHistory(),
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
    }
    ]
})


export default router;