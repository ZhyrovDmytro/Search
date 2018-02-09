import nunjucks from 'nunjucks';
import axios from 'axios';

export default class Search {
    constructor(container) {
        this.container = container;
        this.searchInput = this.container.querySelector('.js-search-input');
        this.searchResult = this.container.querySelector('.js-search-result');
        this.searchResultDesc = this.container.querySelector('.js-search-result--description');


        const jsTemplate = 'http://localhost:5001/js/templates';
        this.nunjEnv = nunjucks.configure(jsTemplate);

        this.searchInput.addEventListener('input', this.requestService);
    }

    /**
     * get request with data
     */
    requestService = (event) => {
        axios.all([
            axios.get('https://swapi.co/api/people/'), // get people data
            axios.get('https://swapi.co/api/people/?page=2') // get another people data
        ])
            .then(axios.spread((peopleListFirst, peopleListSecond) => {
                const firstList = peopleListFirst.data.results; // path to information what we need
                const secondList = peopleListSecond.data.results;// path to information what we need
                const fullStack = firstList.concat(secondList); // merge two lists in one
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
        let personName;

        const myItem = results.forEach(item => {
            personName = item.name;
        });

        this.searchResult.innerHTML = insertTemplate;
        this.findPersonByName();

        if (this.searchInput.value === '') this.searchResult.innerHTML = ''; // delete search result when input is empty

    }

    findPersonByName = () => {
        const table = this.container.querySelector('.js-search-table');
        const rows = this.container.querySelectorAll('.js-search-row');
        const item = this.container.querySelector('.js-search-item');
        const itemName = this.container.querySelectorAll('.js-search-name');

        for (let i = 0; i < rows.length; i += 1) {
            const itemName = rows[i].querySelectorAll('.js-search-item')[0];
            const findName = itemName.querySelector('.js-search-name');
            if (itemName) {
                if (findName.innerHTML.toUpperCase().indexOf(this.searchInput.value.toUpperCase()) > -1) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }
    }
}
