
import PixabayAPIService from "./fetch-photos"
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'
import { Notify } from "notiflix";

const form = document.querySelector('.search-form')
const input =  document.querySelector('input')
const gallery = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')

const backgroundRef = document.querySelector('.background')
const pixabayApi = new PixabayAPIService

form.addEventListener('submit', onFormSubmit)
loadMoreBtn.addEventListener('click', onLoadMore)


function onFormSubmit(e){
  e.preventDefault()
  pixabayApi.resetPage()
  
  pixabayApi.searchQuery = getKeyWords(input.value)

  pixabayApi.onFetchPhotos().then((photos) => 
    {
      const fetchedPhotosData = photos.data
      gallery.innerHTML = ''
      if (fetchedPhotosData.total === 0) {
        Notify.info('Sorry, there are no images matching your search query. Please try again.')
        return
      }

      backgroundRef.classList.add('hidden')
      setTimeout(() => {
        console.log(photos)
        if (fetchedPhotosData.totalHits >= pixabayApi.perPage) loadMoreBtn.classList.remove('disabled')
        else loadMoreBtn.classList.add('disabled')

        Notify.info(`Hooray! We found ${fetchedPhotosData.totalHits} images.`)
        backgroundRef.style.display = 'none'
        fetchingPhotos(fetchedPhotosData.hits)
      }, 250)
      
    }
  ).catch((error) => console.log(error))
}


 
 function onLoadMore () {

  pixabayApi.onFetchPhotos().then((photos) => 
    {
      const fetchedPhotosData = photos.data

      if (fetchedPhotosData.totalHits < pixabayApi.perPage) loadMoreBtn.classList.add('disabled')
      fetchingPhotos(fetchedPhotosData.hits)
    })
 }

 function fetchingPhotos (photos) {
  pixabayApi.incrementPage()
  renderGallery(photos)
 }
 
function renderGallery(array){
  const galMarkup = array.map(({webformatURL, largeImageURL , tags , likes , views ,comments , downloads, imageWidth, imageHeight }) => { 
    return `<div class="photo-card">
    <a class="photo-link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
      <div class="info">
      <p class="info-item">
        Likes: ${formatNumbers(likes)}
      </p>
    
      <p class="info-item">
        Views: ${formatNumbers(views)}
      </p>
      
      <p class="info-item">
        Comments: ${formatNumbers(comments)}
      </p>
      
      <p class="info-item">
        Downloads: ${formatNumbers(downloads)}
      </p>
    </div>
  </div>`
  }).join('')
  console.log(galMarkup)
  
  gallery.insertAdjacentHTML('beforeend', galMarkup)

  new SimpleLightbox('.photo-link');
  }
  

function getKeyWords (searchQuery) {
    return searchQuery.split(' ').join('+')
}


  function formatNumbers (number) {
    return number.toLocaleString()
  }