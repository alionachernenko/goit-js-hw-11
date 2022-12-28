
import axios from 'axios';

export default class PixabayAPIService {
  constructor() {
    this.baseUrl =
      'https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true';
    this.key = '32346607-2f4a4184af58487b859814685';
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async onFetchPhotos() {
    const url = `${this.baseUrl}&key=${this.key}&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}`;
    const response = await axios.get(url);
    return response;
  }

  incrementPage () {
    this.page += 1
  }

  resetPage () {
    this.page = 1
  }
}