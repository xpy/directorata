define(['Vue', 'Api'], function (Vue, Api) {
    Vue.prototype.$bus = new Vue({});
    Vue.prototype.$api = new Api('http://api.themoviedb.org/3/?api_key=b0e628aceae4399d1032199a4bfb5894');


    let app = new Vue({
        el: '#app',
        data: {
            contentClasses: {
                'is-not-loaded': true,
                'is-loading': false,
                'is-loaded': false
            },
            running: false
        },

        async created() {
            // this.start();

            // return // Zheng Jun-Li Directing 1112331
            this.createDB().then(async db => {
                const directors = await (new Promise(resolve => {
                    require(['directors'], (x) => resolve(x))
                }));
                this.getDirectors(db).then(savedDirectors => {
                    const savedNames = savedDirectors.map(x => x.name);
                    const unknown = [];
                    console.log('savedNames', savedNames);
                    directors.forEach(name => {
                        if (name === 'Zheng Jun-Li') {
                            debugger
                        }
                        if (!savedNames.includes(name)) {
                            unknown.push(name)
                        }
                    })
                    console.log('unknown', unknown);
console.log(savedDirectors);
                })
            })
        },
        methods: {
            createDB() {
                return new Promise(resolve => {
                    const request = window.indexedDB.open("scrap", 1);
                    request.onupgradeneeded = function (event) {
                        const db = event.target.result;
                        let objectStore = db.createObjectStore("directors", {keyPath: "id"});
                        objectStore.createIndex("name", "name", {unique: false});
                    };
                    request.onsuccess = (event) => {
                        console.log('??????');
                        resolve(event.target.result)
                    }
                    request.onerror = (event) => {
                        console.log('??????error???', event);
                    }
                })

            },
            async start() {
                const directors = await (new Promise(resolve => {
                    require(['directors'], (x) => resolve(x))
                }));
                this.createDB().then(db => {
                    this.getDirectors(db).then(savedDirectors => {
                        const savedNames = savedDirectors.map(x => x.name);
                        this.fetchLoop(db, directors.filter(x => !savedNames.includes(x)))
                    })
                })
            },
            fetch(db, director) {
                return new Promise(resolve => {
                    this.$api.searchPeople(director).then((x) => {
                        // console.log('x', x);
                        if (x.results.length === 0) {
                            console.log('UNKNOWN', director);
                            resolve()
                        }
                        const transaction = db.transaction(["directors"], "readwrite");
                        transaction.oncomplete = function (event) {
                            console.log("All done!");
                        };
                        transaction.onerror = function (event) {
                            // console.log('error', event);
                            if (event.target.error.toString() === 'ConstraintError: Key already exists in the object store.') {
                                resolve()
                            }
                        };
                        const objectStore = transaction.objectStore("directors");
                        x.results.forEach((result) => {
                            const request = objectStore.add({id: result.id, name: result.name})
                            request.onsuccess = (event) => {
                                console.log('success!!', event)
                                resolve()
                            };
                        });
                    })
                });
            },
            fetchLoop(db, directors) {
                if (directors.length === 0) {
                    return
                }
                this.fetch(db, directors.pop()).then(() => this.fetchLoop(db, directors))
            },
            fetchCallbackLoop(db, list, callback) {
                if (list.length === 0) {
                    return
                }
                callback(db, list.pop()).then(() => this.fetchCallbackLoop(db, list, callback))
            },
            getDirectors(db) {
                return new Promise(resolve => {
                    const directors = [];
                    db.transaction('directors').objectStore('directors').openCursor().onsuccess = function (event) {
                        const cursor = event.target.result;
                        if (cursor) {
                            console.log(cursor.key, cursor.value.name);
                            directors.push(cursor.value);
                            cursor.continue()
                        } else {
                            console.log("DONE");
                            resolve(directors)
                        }
                    }
                })
            }
        },
    });

})

