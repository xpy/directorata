define(['base-api', 'Fuse'], function (BaseApi, Fuse) {
    class Api extends BaseApi {
        static #_directors = null;
        static async directors() {
            if (Api.#_directors === null) {
                Api.#_directors = await fetch('./js/directors.json').then(response => response.json()).then(data=>data)
            }
            return Api.#_directors
        }

        async searchPeople(searchString, page) {
            const options = {
                // isCaseSensitive: false,
                // includeScore: false,
                // shouldSort: true,
                // includeMatches: false,
                // findAllMatches: false,
                // minMatchCharLength: 1,
                // location: 0,
                // threshold: 0.6,
                // distance: 100,
                // useExtendedSearch: false,
                // ignoreLocation: false,
                // ignoreFieldNorm: false,
                keys: [
                    "name"
                ]
            };

            const fuse = new Fuse(await Api.directors(), options);
            return new Promise(function (resolve) {
                resolve({results: fuse.search(searchString).map(x=>x.item)});
            }.bind(this));
        }

        getPersonMovies(id) {
            let promise = super.getPersonMovies(id);
            return new Promise(function (resolve) {
                let today = new Date(),
                    themSelves = new RegExp(/\b(himself|self|herself|voice)\b/);
                promise.then(function (data) {
                    const movies = data.crew.filter(x =>
                        x.job == 'Director'
                        && !x.genre_ids.includes(99)
                        && x.genre_ids.length > 0
                        // && !themSelves.exec(x.character.toLowerCase())
                        && x.vote_count > 1
                        && x.release_date !== ""
                        && new Date(x.release_date) < today)
                    resolve(movies)
                });

            })
        }
    }

    return Api
})