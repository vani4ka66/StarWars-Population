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

    static get events() {

        return {
            PERSON_BORN: 'person_born',
            POPULATING_COMPLETED: 'populating_completed'
        }
    }

    get populationCount() {
        return this.population.length;
    }

    async populate() {
        await fetch('https://swapi.boom.dev/api/planets?page=1')
            .then(response => response.json())
            .then(data => {

                data.results.map(i => {

                    for (var element in i.residents) {
                        if (this.population.length < 10) {
                            this.population.push(i.residents[element])
                            // this.emit(Planet.events.PERSON_BORN);

                            fetch(i.residents[element])
                                .then(response => response.json())
                                .then(data => {

                                    console.log(data)
                                    if (this.peopleData.length < 10) {
                                        this.peopleData.push(data)
                                        console.log(this.peopleData.length)

                                    }
                                });

                        }
                    }

                    this.emit(Planet.events.POPULATING_COMPLETED);
                })
            });

        console.log(this.peopleData.length)


    }


}