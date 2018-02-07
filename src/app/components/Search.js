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
            url: 'http://localhost:5003/products'
        })
            .then((response) => {
                this.renderResults(response.data);
            })
            .catch((error) => {
                console.error('Failed!');
            });
    }

    renderResults = data => {
        const items = data.items;
        let NAME;
        let ITEM;
        let DESCRIPTION;

        items.forEach(item => {
            const itenName = item.name;
            const itenDescription = item.description;

            DESCRIPTION = itenDescription;
            NAME = itenName;

            // ITEM = {
            //     NAME,
            //     DESCRIPTION
            // };

            this.findByName(DESCRIPTION, NAME);
        });

        if (this.searchInput.value === '') this.searchResult.innerHTML = '';
    }

    findByName = (DESCRIPTION, NAME) => {
        // const template = this.nunjEnv.getTemplate('result.nunj');

        // const insertTemplate = template.render({ ITEM });

        if (this.searchInput.value === NAME) {
            this.searchResult.innerHTML = NAME;
            console.log(DESCRIPTION);
            this.searchResultDesc.innerHTML = DESCRIPTION;
        }
    }
}
