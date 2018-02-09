import nunjucks from 'nunjucks';
import axios from 'axios';
import { API, template, state } from './../constants';

export default class Search {
    constructor(container) {
        this.container = container;
        this.searchInput = this.container.querySelector('.js-search-input');
        this.searchResult = this.container.querySelector('.js-search-result');
        this.searchResultDesc = this.container.querySelector('.js-search-result--description');
        this.personRandom = this.container.querySelector('.js-random-hero');

        this.nunjEnv = nunjucks.configure(template.templatePath);

        // if (this.personRandom) this.personRandom.addEventListener('click', this.requestService); // doesnt work fine
        this.searchInput.addEventListener('input', this.requestService);
    }

    /**
     * get request with data
     */
    requestService = () => {
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

        // this.findPersonRandom(); // doesnt work fine
        this.findPersonByName();
    }

    // searching person by name
    findPersonByName = () => {
        const table = this.container.querySelector('.js-search-table');
        const rows = this.container.querySelectorAll('.js-search-row');
        const item = this.container.querySelector('.js-search-item');
        const itemName = this.container.querySelectorAll('.js-search-name');

        rows.forEach(row => {
            const itemName = row.querySelectorAll('.js-search-item')[0];
            const findName = itemName.querySelector('.js-search-name');
            const findNameValue = findName.innerHTML.toUpperCase();
            const searchInputValue = this.searchInput.value.toUpperCase();
            const searchMatched = findNameValue.indexOf(searchInputValue) > -1;

            if (itemName) {
                if (searchMatched) {
                    itemName;
                } else {
                    row.classList.add(state.disable);
                }
            }
            if (this.searchInput.value === '') this.searchResult.innerHTML = ''; // delete search result when input is empty
        });
    }

    // Doesnt works fine.

    // findPersonRandom = () => {
    //     const rows = this.container.querySelectorAll('.js-search-row');
    //     const randome = rows[Math.floor(Math.random() * rows.length)];

    //     rows.forEach(row => {
    //         row.classList.add(state.disable);
    //     });

    //     randome.classList.add('active');
    // }
}
