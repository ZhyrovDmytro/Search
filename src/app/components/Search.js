import nunjucks from 'nunjucks';
import axios from 'axios';

export default class Search {
    constructor(container) {
        this.container = container;
        this.searchInput = this.container.querySelector('.js-search-input');
        this.searchResult = this.container.querySelector('.js-search-result');

        const jsTemplate = 'http://localhost:5001/js/templates';
        this.nunjEnv = nunjucks.configure(jsTemplate);

        this.searchInput.addEventListener('input', this.requestService);
    }

    requestService = (event) => {
        axios({
            method: 'get',
            url: 'http://localhost:5003/products'
        })
        .then((response) => {
            this.renderResults(response.data);
            console.info('Success!');
        })
        .catch((error) => {
            console.error('Failed!');
        });
    }

    renderResults = data => {
        const template = this.nunjEnv.getTemplate('result.nunj');
        const insertTemplate = template.render({ data });

        this.searchResult.innerHTML = insertTemplate;
        if (this.searchInput.value === '') this.searchResult.innerHTML = '';
        console.log(this.searchInput.value);
    }
}
