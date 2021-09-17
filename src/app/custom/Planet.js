import EventEmitter from 'eventemitter3';
import Person from './Person';
import StarWarsUniverse from './StarWarsUniverse';

export default class Planet extends EventEmitter {
    constructor(name) {
        super()

        this.name = name;
        this.config = {
            populationDelay: 1
        }
        this.peopleData = [];
        this.population = [];

        this.populate();
    }

    handlerPlanet() {
        this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED);
    }


    static get events() {

        return {
            PERSON_BORN: 'person_born',
            POPULATING_COMPLETED: 'populating_completed'
        }
    }

    get populationCount() {
        return this.population.length;
    }

    populate() {
        fetch('https://swapi.boom.dev/api/planets?page=1')
            .then(response => response.json())
            .then(data => {

                data.results.map(i => {

                    // console.log(data)

                    for (var element in i.residents) {
                        if (this.population.length < 10) {
                            this.population.push(i.residents[element])
                            this.emit(Planet.events.PERSON_BORN);

                            fetch(i.residents[element])
                                .then(response => response.json())
                                .then(data => {

                                    if (this.peopleData.length < 10) {

                                        let human = new Person(data.name, data.height, data.mass)
                                        this.emit(Planet.events.PERSON_BORN);

                                        // console.log(human)
                                        this.peopleData.push(data)
                                        this.population.push(human)

                                        // setTimeout(function () {

                                        // }, 1000);


                                    }

                                })


                        }
                    }

                    this.emit(Planet.events.POPULATING_COMPLETED);
                    this.emit(Planet.events.POPULATING_COMPLETED, this.handlerPlanet);
                    // this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED);

                    // console.log(this.populationCount)

                })
            });

        // console.log(this.populationCount)
      



    }


}