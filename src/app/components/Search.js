import nunjucks from 'nunjucks';
import axios from 'axios';
import { API, template, state, nunjucksOption } from './../constants';

export default class Search {
    constructor(container) {
        this.container = container;
        this.searchInput = this.container.querySelector('.js-search-input');
        this.searchResult = this.container.querySelector('.js-search-result');
        this.personRandomButton = this.container.querySelector('.js-random-hero');
        this.loader = this.container.querySelector('.spinner');

        this.nunjEnv = nunjucks.configure(template.templatePath, nunjucksOption.web);

        this.personRandomButton.addEventListener('click', this.findPersonRandom);
        this.searchInput.addEventListener('input', this.requestService);
    }

    /**
     * get request with data from the server
     */
    requestService = () => {
        this.searchValue = this.searchInput.value;
        this.setDataSpin();

        axios.all([
            axios.get(API.peopleListPath + this.searchValue) // get people data
        ])
            .then(axios.spread((peopleListFirst, peopleListSecond) => {
                const firstList = peopleListFirst.data.results; // path to information what we need
                this.renderResults(firstList);
            }))
            .catch((error) => {
                console.warn('Failed!'); // error if failed
            });
    }

    /**
     * description: render template
     * @param {Object} results - data from server
     */
    renderResults = (results) => {
        const template = this.nunjEnv.getTemplate('result.nunj');
        const insertTemplate = template.render({ results }); // rendering nunjucks template

        this.searchResult.innerHTML = insertTemplate;

        this.resetDataSpin();
        this.findPersonByName();
    }

    /**
     * description: Searching person in list
     */
    findPersonByName = () => {
        const rows = this.container.querySelectorAll('.js-search-row');

        rows.forEach(row => {
            const findNameValue = row.textContent.toUpperCase();
            const searchInputValue = this.searchInput.value.toUpperCase();
            const searchMatched = findNameValue.includex(searchInputValue);

            if (findNameValue) {
                if (searchMatched) {
                    findNameValue;
                } else {
                    row.classList.add(state.disable);
                }
            }
        });

        this.searchInput.addEventListener('focusout', () => {
            if (this.searchInput.value === '') this.searchResult.innerHTML = ''; // delete search result when input is empty
        });
    }

    /**
     * description: Searching Random person in list
     */
    findPersonRandom = () => {
        const rows = [...this.container.querySelectorAll('.js-search-row')];
        const random = rows[Math.floor(Math.random() * rows.length)];

        if (random === undefined) {
            this.requestService();
        } else {
            for (let i = 0; i < rows.length; i += 1) {
                rows[i].classList.add(state.disable);
                if (rows[i].classList.contains(state.active)) rows[i].classList.remove(state.active);
            }
        }

        random.classList.add(state.active);
    }

    // add load spinner
    setDataSpin = () => {
        this.loader.classList.add(state.active);
    }

    // delete load spinner
    resetDataSpin = () => {
        this.loader.classList.remove(state.active);
    }
}
