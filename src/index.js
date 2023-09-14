import axios from 'axios';
import { fetchBreeds, fetchCatByBreed, createSelect } from './cat-api';

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');

axios.defaults.baseURL = 'https://api.thecatapi.com/';
axios.defaults.headers.common['x-api-key'] =
  'live_OCkEOjG94SMl2WhtszkoVkvhynaMaYATELP1Fw86WLaMyxMSbcwY8WS6NQeJdUfl';

const selector = e => {
  e.preventDefault();
  const catId = e.currentTarget.value;
  fetchCatByBreed(catId);
};

breedSelect.addEventListener('submit', createSelect);
breedSelect.dispatchEvent(new Event('submit'));

breedSelect.addEventListener('change', selector);
