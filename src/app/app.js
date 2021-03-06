import 'babel-polyfill';
/**
 * https://github.com/Keyamoon/svgxuse
 * If you do not use SVG <use xlink:href="…"> elements, remove svgxuse module
 */
import 'svgxuse';
import init from './init';
import { render, renderFactory } from './render';
import Search from './components/Search';

const app = (config) => {
    init(Search, document.querySelector('.js-search'));
};

app(null, window.config);
