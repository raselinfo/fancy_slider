const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const spinner = document.getElementById("spinner");
const gallery__row = document.getElementById("gallery__row");
const search__container = document.getElementById("search__container");
const search__result = document.getElementById("search__result");

// selected image 
let sliders = [];
// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {

  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

  loadSpinner();
  notFound();
  searchResult(images);

}

const getImages = async (query) => {
  loadSpinner();
  try {
    const url = `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
    const res = await fetch(url);
    const data = await res.json();
    showImages(data.hits)
  } catch (error) {
    console.log(error);
  }

}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);

  } else {
    const imgIndexNumber = sliders.indexOf(img);
    sliders.splice(imgIndexNumber, 1);
    element.classList.remove("added")

  }
}
// Create Slider
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {

    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = parseInt(document.getElementById('duration').value);

  if (duration == 0 || duration < 0) {
    duration = 500;
  }
  else if (isNaN(duration)) {
    duration = 1000;
  } else {
    duration = duration;
  }
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

// Click Search by Enter key
document.getElementById("search").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }

})
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;

})

sliderBtn.addEventListener('click', function () {
  createSlider()
})



// Extra Features
const loadSpinner = () => {
  spinner.classList.toggle('d-none')
  gallery__row.classList.toggle('d-none')



}

// for nothing found
const notFound = () => {
  if (gallery__row.innerHTML == "") {
    document.getElementById("empty__error").classList.remove("d-none");

  } else {
    document.getElementById("empty__error").classList.add("d-none");
  }
}

// Search Result
const searchResult = (result) => {
  search__result.innerText = result.length;
  search__container.classList.remove("d-none");
}