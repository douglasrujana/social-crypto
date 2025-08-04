export default {
    name: 'juno-layout',
    path: '/',
    component: () => import('@/modules/juno/layouts/JunoLayout.vue'),
    children: [
        {
            name: 'juno-home',
            path: '',
            component: () => import('@/modules/juno/views/JunoView.vue')
        },
        {
            name: 'juno-wallet',
            path: 'juno/:wallet?',
            component: () => import('@/modules/juno/views/WalletView.vue')
        },
        {
            name: 'juno-hashtag',
            path: 'juno/ht/:hashtag?',
            component: () => import('@/modules/juno/views/HashtagView.vue')
        },
        {
            name: 'juno-post',
            path: 'juno/p/:key?',
            component: () => import('@/modules/juno/views/PostView.vue')
        }
    ]
}