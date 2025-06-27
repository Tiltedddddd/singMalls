// main.js – Index Homepage Script
import { malls } from './mallData.js';
import { initializeSwipers } from './slider.js';

function renderFilteredMalls(filteredMalls) {
  const mallSection = document.querySelector('.mall-section');
  mallSection.innerHTML = ''; //clear all regions

  const section = document.createElement('section');
  section.className = 'region-section';
  section.innerHTML = `
  <h2 class="region-title">Search Results:</h2>
  <div class="container swiper">
    <div class="slider-wrapper">
      <div class="card-list swiper-wrapper" data-region-list="Search"></div>
      <div class ="swiper-pagination"></div>
      <div class="swiper-slide-button swiper-button-prev"></div>
      <div class="swiper-slide-button swiper-button-next"></div>
    </div>
  </div>
  `;

  const cardList = section.querySelector('.swiper-wrapper');

  if (filteredMalls.length === 0) {
    cardList.innerHTML = `
    <div style="padding: 3rem; color: black;">
      No malls found matching your search.<br><br>(SingMalls is still currently still in development so check back soon!)
    </div>
    `;
  } else {
    filteredMalls.forEach(mall => {
      const mallCard = document.createElement('div');
      mallCard.className = 'card-item swiper-slide';
      const imageUrl = mall.image ? mall.image : "assets/images/defaultStoreLogo.webp";
      mallCard.innerHTML = `
        <a href="mallDetail.html?id=${mall.id}" class ="card-link">
          <div class="card-bg" style="background-image: url('${imageUrl}')"></div>
        </a>
        <div class="card-content">
          <h2 class="mall-name">${mall.name}</h2>
        </div>
      `;

      cardList.appendChild(mallCard);
    });
  }

  mallSection.appendChild(section);
  initializeSwipers();
}

function renderMallsByRegion(malls) {
  malls.forEach(mall => {
    const regionList = document.querySelector(`[data-region-list="${mall.region}"]`); /*Targets data attribute in [], Template strings*/
    if (!regionList) return;

    const mallCard = document.createElement('div');
    mallCard.className = 'card-item swiper-slide';
    const imageUrl = mall.image ? mall.image : "assets/images/defaultStoreLogo.webp";
    mallCard.innerHTML = `
      <a href="mallDetail.html?id=${mall.id}" class="card-link">
        <div class="card-bg" style="background-image: url('${imageUrl}')"></div>
      </a>
      <div class="card-content">
        <h2 class="mall-name">${mall.name}</h2>
      </div>
    `; /*Generating the HTML*/

    regionList.appendChild(mallCard); /*Appends generate HTML To the right region swiper*/
  });

  initializeSwipers();
}

let originalMallHTML = '';
document.addEventListener('DOMContentLoaded', () => {
  console.log("Disclaimer acknowledged:", localStorage.getItem("singmallsDisclaimerAcknowledged"));

  renderMallsByRegion(malls);

  //logic for the searchbar
  const mallSection = document.querySelector('.mall-section');
  const searchInput = document.querySelector('.search_input');

  //Initial regional layout
  originalMallHTML = mallSection.innerHTML;


  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase().trim();

    if(keyword === '') {
      mallSection.innerHTML = originalMallHTML;
      renderMallsByRegion(malls);
      return;
    }

    const filtered = malls.filter(mall =>
      mall.name.toLowerCase().includes(keyword)
    );

    mallSection.innerHTML = ''; //Clear all sections
    renderFilteredMalls(filtered);

  });

  // Logic for popup modal, using local storage to only pop up once per session
  const modal = document.getElementById("disclaimerModal");
  const closeBtn = document.getElementById("disclaimerCloseBtn");

  const hasAcknowledged = localStorage.getItem("singmallsDisclaimerAcknowledged") === "true";
  console.log("Disclaimer acknowledged:", hasAcknowledged);

  if (!hasAcknowledged) {
    modal.style.display = "flex";

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      localStorage.setItem("singmallsDisclaimerAcknowledged", "true");
    });
  } else {
    modal.style.display = "none"; 
  }
});







  















/**
 * main.js (SingSplore)
 * ---------------------
 * Dynamically generates mall cards for the homepage using mall data from mallData.js.
 * 
 * Handles popup logic using LocalStorage to prevent the popup showing on every reload of the page.
 *
 * Key Features:
 * - Renders malls by region into Swiper carousels (Central, North, South, etc.)
 * - Supports real-time mall name search with live filtering
 * - Automatically resets layout when search input is cleared
 * - Initializes Swiper sliders after rendering, using a reusable initializeSwipers() function
 *
 * Search Logic:
 * - Captures initial DOM layout and restores it when input is cleared
 * - Dynamically injects a "Search Results" section when filtering
 *
 * Dependencies:
 * - mallData.js — contains all mall info and shop listings
 * - slider.js — contains and exports the Swiper initialization logic
 *
 *  Notes:
 * - Must be run as a module (type="module")
 * - Each region section in HTML must match a `data-region-list` attribute
 * - Swiper styles and slider-wrapper class are required for correct layout
 * 
 * * Issues when making:
 * Cards being generated by the HTML no longer had spacings in them like they did when they were hardcoded
 * SwiperJS was wonky due to it being rendered before any cards were being generated
 * FIXED by adding initializeSwiper() Function AFTER Cards are generated
 */