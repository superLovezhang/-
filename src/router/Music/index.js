export default {
    path: '/Music',
    component: ()=> import('@/views/Music'),
    children: [
        {
            path: '/',
            redirect: 'NowPlaying'
        },
        {
            path: 'NowPlaying',
            component: ()=> import('@/components/NowPlaying')
        },
        {
            path: 'Recommend',
            component: ()=> import('@/components/Recommend')
        },
        {
            path: 'Search',
            component: ()=> import('@/components/MusicList')
        },
        {
            path: 'Heard',
            component: ()=> import('@/components/Heard')
        },
        {
            path: 'Detail/:id',
            component: ()=> import('@/components/NowPlaying')
        }
    ]
}