import EventEmitter from 'eventemitter3';
import Planet from './Planet';
import Film from './Film';


export default class StarWarsUniverse extends EventEmitter {
    constructor(planet = null) {
        super()

        this.films = [];
        this.planet = planet;

        this.init()
    }

    static get events() {

        return {
            FILM_ADDED: 'film_added',
            UNIVERSE_POPULATED: 'universe_populated'
        }
    }

    async init() {

        await fetch('https://swapi.dev/api/planets/')
            .then(response => response.json())
            .then(data => {

                let next = data.next;
                let numberOfPages = parseInt(data.count / 10);

                for (let i = 1; i <= numberOfPages; i++) {
                    next = next.substring(0, next.length - 1) + i;

                    if (next !== null) {

                        fetch(next)
                            .then(response => response.json())
                            .then(data => {

                                data.results.map(j => {

                                    //Planet
                                    if (j.population == 0) {

                                        let planet = new Planet(j.name)
                                        this.planet = planet;
                                    }

                                    //People
                                    // for (var peopleUrl in j.residents) {

                                    //     if (this.planet.population.length < 10) {
                                    //         this.planet.population.push(j.residents[peopleUrl]);
                                    //     } else {
                                    //         return
                                    //     }
                                    // }

                                    //Films
                                    for (var url in j.films) {

                                        let film = new Film(j.films[url])

                                        if (!this.films.find(o => o.url === j.films[url])) {
                                            this.films.push(film);
                                            this.emit(StarWarsUniverse.events.FILM_ADDED);

                                        }
                                    }

                                })
                            });
                    }
                }

            });


        // console.log(this.films)
    }
}