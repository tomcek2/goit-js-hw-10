import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');

const APIKey =
  'live_OCkEOjG94SMl2WhtszkoVkvhynaMaYATELP1Fw86WLaMyxMSbcwY8WS6NQeJdUfl';

axios.defaults.baseURL = 'https://api.thecatapi.com/';
axios.defaults.headers.common[APIKey] = 'TOM_CEK';

const selector = e => {
  e.preventDefault();
  const catId = e.currentTarget.value;
  fetchCatByBreed(catId);
};

breedSelect.addEventListener('submit', fetchBreeds);
breedSelect.dispatchEvent(new Event('submit'));

breedSelect.addEventListener('change', selector);
