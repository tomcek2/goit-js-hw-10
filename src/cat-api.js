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

//  Fetching breeds form api  //
const breedList = [];
function fetchBreeds() {
  axios
    .get('/v1/breeds')
    .then(response => response.data)
    .then(data => {
      breedList.push(...data);
      console.log(typeof breedList);
      console.log(breedList);
      console.log(breedList[0]);
    })
    .catch(e => {
      // handle error
      console.log(e);
    });
}

//  Creating options to select list from api informations  //
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
const createSelect = e => {
  e.preventDefault();
  showLoader(breedSelect);
  fetchBreeds();
  const promise = new Promise(resolve => {
    if (fetchBreeds) {
      resolve(breedList);
    }
  });
  promise
    .then(breed => {
      console.log(typeof breed);
      console.log(breed);
      console.log(breed[0]);
      console.log(typeof breedList);
      console.log(breedList);
      console.log(breedList[0]);
      breedSelect.append(...breed.map(optionList));
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

// Fetching cat informations from api  //
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
      // handle error
      console.log(e);
    });
  axios
    .get('/v1/breeds')
    .then(response => response.data)
    .then(data => {
      return data.find(breed => breed.id === breedId);
    })
    .then(info => {
      catInfo.append(catInfoSection(info));
    })
    .catch(e => {
      //  handle error  //

      showError();
      console.log(e);
    })
    .finally(() => {
      hideLoader(catInfo);
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
