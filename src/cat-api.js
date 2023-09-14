import axios from 'axios';
export { fetchBreeds, createElement, fetchCatByBreed, createSelect };

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

axios.defaults.baseURL = 'https://api.thecatapi.com/';
axios.defaults.headers.common['x-api-key'] =
  'live_OCkEOjG94SMl2WhtszkoVkvhynaMaYATELP1Fw86WLaMyxMSbcwY8WS6NQeJdUfl';

// Function to create element  //
const createElement = ({
  type = 'div',
  classList = [],
  text = '',
  content = [],
  attributes = {},
}) => {
  const el = document.createElement(type);
  el.classList.add(...classList);
  if (text) {
    el.textContent = text;
  }
  if (content) {
    el.append(...content);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
};

// Fetching cat info form API  //
const breedList = [];

function fetchBreeds() {
  return axios
    .get('/v1/breeds')
    .then(response => response.data)
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

const optionList = breed => {
  const breedOptions = createElement({
    type: 'option',
    classList: ['breed'],
    attributes: {
      value: breed.id,
    },
    text: `${breed.name}`,
  });
  return breedOptions;
};

//  Creating select menu  //
const createSelect = e => {
  e.preventDefault();
  showLoader(breedSelect);
  fetchBreeds()
    .then(breedData => {
      breedSelect.append(...breedData.map(optionList));
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      hideLoader(breedSelect);
    });
};

//  Creating cat photo //
const catPhoto = photo => {
  const catElement = createElement({
    type: 'img',
    attributes: {
      src: photo.url,
    },
  });
  catElement.style.maxWidth = '30%';
  catElement.style.height = 'auto';
  catElement.style.border = '1px solid #ddd';
  catElement.style.borderRadius = '4px';
  catElement.style.padding = '5px';
  return catElement;
};

// Informations section //
const catInfoSection = info => {
  const infoSection = createElement({
    type: 'div',
    classList: ['info-section'],
  });
  const catName = createElement({
    type: 'h2',
    classList: ['cat-name'],
    text: info.name,
  });
  const catDescription = createElement({
    type: 'div',
    classList: ['cat-description'],
    text: info.description,
  });
  const catTemp = createElement({
    type: 'div',
    classList: ['cat-temp'],
    text: `Temperament: ${info.temperament}`,
  });
  const temp = createElement({
    type: 'span',
    classList: ['temp'],
    text: 'Temperament: ',
  });

  infoSection.style.margin = '20px';
  catDescription.style.padding = '20px 0';
  temp.style.fontWeight = 'bold';
  catTemp.prepend(temp);
  infoSection.append(catName);
  infoSection.append(catDescription);
  infoSection.append(catTemp);

  return infoSection;
};

// Fetching cat photo from api  //
const fetchCatByBreed = breedId => {
  showLoader(catInfo);
  while (catInfo.firstChild) {
    catInfo.removeChild(catInfo.firstChild);
  }
  axios
    .get(`/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data)
    .then(data => {
      catInfo.prepend(...data.map(catPhoto));
    })
    .catch(e => {
      console.log(e);
    });
  //  Creating cat information section  //
  fetchBreeds()
    .then(data => {
      return data.find(breed => breed.id === breedId);
    })
    .then(info => {
      catInfo.append(catInfoSection(info));
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      hideLoader(breedSelect);
    });
};

catInfo.style.display = 'flex';

//  Loader  //

function showLoader(load) {
  loader.classList.add('visible');
  load.classList.add('none');
  if (load === catInfo) {
    loader.classList.add('info');
  } else {
    loader.classList.add('select');
  }
}
function hideLoader(load) {
  loader.classList.remove('visible');
  load.classList.remove('none');
}

//  Error  //

function showError() {
  error.classList.add('visible');
}
