import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { searchQuery } from './js/search';
import { createGalleryMarkup } from './js/markup';

const refs = {
  searchFormEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  buttonEl: document.querySelector('.load-more'),
}

const MESSAGE = 'Please, enter key word for search!';
const MESSAGE_INFO = 'Were sorry, but youve reached the end of search results.';
const MESSAGE_ERROR = 'Sorry, there are no images matching your search query. Please try again.';

const lightbox = new SimpleLightbox('.gallery a', {
  CaptionDelay: 300,
  captions: true,
  captionsData: 'alt',
});

refs.searchFormEl.addEventListener('submit', onSearchForm);
refs.buttonEl.addEventListener('click', onBtnClick);

async function onSearchForm(evt) {
  evt.preventDefault();
  refs.buttonEl.classList.add('visually-hidden');
  searchQuery.page = 1;

  const query = evt.target.elements.searchQuery.value.trim();

  const response = await searchQuery.searchPictures(query);
  console.log(response);
  const galleryItem = response.hits;

  try {
    refs.galleryEl.innerHTML = '';
    if (galleryItem.length === 0) {
      Notiflix.Notify.info(MESSAGE_ERROR);
    } else if (!query) {
      Notiflix.Notify.info(MESSAGE);

      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      renderingMarkup(response.hits);
      refs.buttonEl.classList.remove('visually-hidden');
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function onBtnClick() {
  searchQuery.page += 1;

  const response = await searchQuery.searchPictures();
  if (searchQuery.page > response.totalHits / searchQuery.per_page) {
    refs.buttonEl.classList.add('visually-hidden');
    Notiflix.Notify.failure(MESSAGE_INFO);
  }
  renderingMarkup(response.hits);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function renderingMarkup(array) {
  refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryMarkup(array));
  lightbox.refresh();
}
