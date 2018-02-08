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

    requestService = (event) => {
        axios({
            method: 'get',
            url: 'https://swapi.co/api/people/'
        })
            .then((response) => {
                this.findByName(response.data.results);
            })
            .catch((error) => {
                console.error('Failed!');
            });
    }

    findByName = (results) => {
        let NAME;
        const template = this.nunjEnv.getTemplate('result.nunj');
        const insertTemplate = template.render({ results });

        const myItem = results.forEach(item => {
            NAME = item.name;
        });
        this.searchResult.innerHTML = insertTemplate;

        this.renderResults();

        if (this.searchInput.value === '') this.searchResult.innerHTML = '';

    }

    renderResults = () => {
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
