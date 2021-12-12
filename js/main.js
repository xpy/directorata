require.config(
    {
        paths: {
            Vue: 'vendor/vue',
            Chart: '//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min',
            Api: 'directors-api',
            Fuse: '//cdn.jsdelivr.net/npm/fuse',
            'base-api': 'https://combinatronics.com/xpy/actorata/v0.1.0/js/base-api',
            'genre-chart':'https://combinatronics.com/xpy/actorata/v0.1.0/js/genre-chart',
            'movie-chart':'https://combinatronics.com/xpy/actorata/v0.1.0/js/movie-chart',
            'person-search':'https://combinatronics.com/xpy/actorata/v0.1.0/js/person-search',
            'person-view':'https://combinatronics.com/xpy/actorata/v0.1.0/js/person-view'
        }
    },
);

require(['app']);