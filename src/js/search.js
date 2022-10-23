import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30789851-c1413f3f8f524f001c558374f';
const SIZE_PAGE = 40;

export class searchQuery {
  static page = 1;
  static image_type = 'photo';
  static key = API_KEY;
  static query = '';
  static orientation = 'horizontal';
  static safesearch = 'true';
  static per_page = SIZE_PAGE;

  static async searchPictures(query = '') {
    if (query.trim()) searchQuery.query = query;

    const config = {
      params: {
        key: searchQuery.key,
        q: searchQuery.query,
        image_type: searchQuery.image_type,
        orientation: searchQuery.orientation,
        safesearch: searchQuery.safesearch,
        per_page: searchQuery.per_page,
        page: searchQuery.page,
        maxPage: searchQuery.maxPage,
      },
    };

    const response = await axios.get(`${BASE_URL}`, config);
    return response.data;
  }
}