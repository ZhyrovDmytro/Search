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
                console.log(response.data.results);
                this.findByName(response.data.results);
            })
            .catch((error) => {
                console.error('Failed!');
            });
    }

    // renderResults = results => {
    //     const myData = results.filter(selectData => {
    //         this.findByName(selectData);

    //         return selectData;
    //     });
    //     }

    findByName = (results) => {
        let NAME;
        const template = this.nunjEnv.getTemplate('result.nunj');
        const insertTemplate = template.render({ results });
        const myItem = results.forEach(item => {
            NAME = item.name;
        });

        if (NAME.toUpperCase().indexOf(this.searchInput.value.toUpperCase()) > -1) {
            this.searchResult.innerHTML = insertTemplate;
        }

        if (this.searchInput.value === '') this.searchResult.innerHTML = '';
    }
}
