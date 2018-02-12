import nunjucks from 'nunjucks';
import axios from 'axios';
import { API, template, state, nunjucksOption } from './../constants';

export default class Search {
    constructor(container) {
        this.container = container;
        this.searchInput = this.container.querySelector('.js-search-input');
        this.searchResult = this.container.querySelector('.js-search-result');
        this.searchResultDesc = this.container.querySelector('.js-search-result--description');
        this.personRandomButton = this.container.querySelector('.js-random-hero');
        this.dataspinner = this.container.querySelector('.spinner');

        this.nunjEnv = nunjucks.configure(template.templatePath, nunjucksOption.web);

        this.personRandomButton.addEventListener('click', this.findPersonRandom);
        this.searchInput.addEventListener('input', this.requestService);
    }

    /**
     * get request with data
     */
    requestService = () => {
        this.setDataSpin();

        axios.all([
            axios.get(API.peopleFirstList), // get people data
            axios.get(API.peopleSecondtList) // get another people data
        ])
            .then(axios.spread((peopleListFirst, peopleListSecond) => {
                const firstList = peopleListFirst.data.results; // path to information what we need
                const secondList = peopleListSecond.data.results;// path to information what we need
                const fullStack = [...firstList, ...secondList]; // merge two lists in one
                this.renderResults(fullStack);
            }))
            .catch((error) => {
                console.error('Failed!'); // error if failed
            });
    }

    // render template
    renderResults = (results) => {
        const template = this.nunjEnv.getTemplate('result.nunj');
        const insertTemplate = template.render({ results });

        this.searchResult.innerHTML = insertTemplate;

        if (this.searchInput.value === '') this.searchResult.innerHTML = ''; // delete search result when input is empty

        this.resetDataSpin();
        this.findPersonByName();
    }

    // searching person by name
    findPersonByName = () => {
        const rows = this.container.querySelectorAll('.js-search-row');

        rows.forEach(row => {
            const findNameValue = row.textContent.toUpperCase();
            const searchInputValue = this.searchInput.value.toUpperCase();
            const searchMatched = findNameValue.indexOf(searchInputValue) > -1;

            if (findNameValue) {
                if (searchMatched) {
                    findNameValue;
                } else {
                    row.classList.add(state.disable);
                }
            }
        });
    }

    // Doesnt works fine.

    findPersonRandom = () => {
        const rows = this.container.querySelectorAll('.js-search-row');
        const randome = rows[Math.floor(Math.random() * rows.length)];

        rows.forEach(row => {
            row.classList.add(state.disable);
            if (row.classList.contains(state.active)) row.classList.remove(state.active);
            randome.classList.add(state.active);
        });
    }

    // add load spinner
    setDataSpin = () => {
        this.dataspinner.classList.add(state.active);
    }

    // delete load spinner
    resetDataSpin = () => {
        this.dataspinner.classList.remove(state.active);
    }
}
