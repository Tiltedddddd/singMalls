import { malls } from './mallData.js';


// Parse the mall ID from the URL (e.g. ?id=bugis-junction)
const params = new URLSearchParams(window.location.search);
const mallId = params.get("id");

const mall = malls.find(m => m.id === mallId);
let shopContainer;


/*
 * Renders the list of shop cards based on filtered data.
 * If none are found, a fallback message is shown.
 */
function renderShops(filteredShops) {
  shopContainer.innerHTML = "";

  if (filteredShops.length === 0) {
    shopContainer.innerHTML = `<p style="text-align:center;">No shops found.</p>`;
    return;
  }

  filteredShops.forEach(shop => {
    const shopDiv = document.createElement("div");
    shopDiv.className = "shop_inner";

    const logo = shop.logo || "assets/images/defaultStoreLogo.webp";

    shopDiv.innerHTML = `
        <div class="shop_logo">
          <img src="${logo}" alt="${shop.name} logo" onerror="this.onerror=null;this.src='assets/images/defaultStoreLogo.webp';">
        </div>
        <div class="shop_info">
          <h3>${shop.name}</h3>
          <p>Floor: ${shop.floor}</p>
          <p>Category: ${shop.category}</p>
        </div>
      `;

    shopContainer.appendChild(shopDiv);
  });
}


/*
 * Filters the mall's shop list by keyword and category chips.
 * Triggers a re-render of the filtered results.
*/

function filterAndRender() {
  const keyword = searchInput.value.toLowerCase();

  const filtered = mall.shops.filter(shop => {
    const matchesKeyword = shop.name.toLowerCase().includes(keyword);
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some(cat => shop.category.includes(cat));

    return matchesKeyword && matchesCategory;
  });

  console.log("Selected categories:", selectedCategories);
  console.log("Filtered shops:", filtered.map(shop => shop.name));
  renderShops(filtered)
}


// Variables for filter modal stuff and filter modal logic
const filterModal = document.querySelector(".filter_chip_modal_overlay");
const filterBtn = document.querySelector(".directory_filter_btn");
const applyFiltersBtn = document.querySelector(".apply_filters_btn");
const searchInput = document.querySelector(".directory_search_input");

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !filterModal.classList.contains("hidden")) {
    filterModal.classList.remove("hidden");
  }
});

// Hides after clicking outside the modal

filterModal.addEventListener("click", (e) => {
  if (e.target === filterModal) {
    filterModal.classList.add("hidden");
  }
});

filterBtn.addEventListener("click", () => {
  filterModal.classList.remove("hidden");
});

let selectedCategories = [];

// Handle filter chip selection toggle

document.querySelectorAll(".filter_chip").forEach(chip => {
  chip.addEventListener("click", () => {
    chip.classList.toggle("active");
    const category = chip.dataset.category;

    if (selectedCategories.includes(category)) {
      selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      selectedCategories.push(category);
    }

    applyFiltersBtn.textContent = `Apply Filters (${selectedCategories.length})`;

    const filterBadge = document.querySelector(".filter_badge");

    if (selectedCategories.length > 0) {
      filterBadge.textContent = selectedCategories.length;
      filterBadge.classList.remove("hidden");
    } else {
      filterBadge.classList.add("hidden");
    };
  });
});

// Apply filter logic and hide modal

applyFiltersBtn.addEventListener("click", () => {
  filterModal.classList.add("hidden");
  filterAndRender();
});

// Clear all filters

const clearFiltersBtn = document.querySelector(".clear_filters_btn")

clearFiltersBtn.addEventListener("click", () => {
  selectedCategories = [];

  document.querySelectorAll(".filter_chip").forEach(chip => {
    chip.classList.remove("active");
  });

  applyFiltersBtn.textContent = `Apply Filters (0)`

  const filterBadge = document.querySelector(".filter_badge");
  filterBadge.classList.add("hidden");
});


// ====== Content init ====== //
if (mall) {
  document.getElementById("mall_name").textContent = mall.name;

  // Header content
  if (document.getElementById("about_desc")) {
    document.getElementById("about_desc").textContent = mall.description;
  }
  if (document.getElementById("about_mrt")) {
    document.getElementById("about_mrt").textContent = mall.mrt;
  }

  // Hero bkg
  document.querySelector(".mall_hero").style.backgroundImage = `url('${mall.image}')`;

  // Render shop directory
  shopContainer = document.getElementById("shops_container");
  renderShops(mall.shops)

  // Promotions tab logic
  const promoContainer = document.querySelector("#promotions_tab  .promo_grid");
  if (mall.promotions && mall.promotions.length > 0) {
    promoContainer.innerHTML = "";

    mall.promotions.forEach(promo => {
      const promoCard = document.createElement("div");
      const image = promo.image || "assets/images/defaultStoreLogo.webp";
      promoCard.className = "promo_card";

      promoCard.innerHTML = `
      <img src="${image}" alt="${promo.title}">
      <h3>${promo.title}</h3><br>
       <p style="text-align:center; font-size: 0.85rem;">${promo.validity}</p><br>
       <p style="font-weight:bold; text-align:center;">${promo.shop}</p>
      `;

      promoContainer.appendChild(promoCard);
    });
  } else {
    promoContainer.innerHTML = `<p style="color:black; text-align: center;">This mall has no current promotions... <br><br>(Singmalls is currently being updated so check back soon!)</p>`;
  };

  // Real-time searchbar filtering logic
  searchInput.addEventListener("input", filterAndRender);

  //generating google map links
  const mapsAnchor = document.getElementById("google_maps_link");
  if (mapsAnchor) {
    mapsAnchor.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mall.name + ' Singapore')}`;
  }


}


// Toggle bar logic
const toggleTabs = document.querySelectorAll(".toggle_tab");
const tabSections = document.querySelectorAll(".tab_section");
const pill = document.querySelector(".pill_indicator");

toggleTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    // Update active tab styling
    toggleTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // Show/hide tab content
    const selected = tab.dataset.tab;
    tabSections.forEach(section => {
      section.style.display = section.id === `${selected}_tab` ? "block" : "none";
    });

    // Animate pill
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.left = `${tab.offsetLeft}px`;
  });
});

// Set initial position of pill on page load
window.addEventListener("DOMContentLoaded", () => {
  const activeTab = document.querySelector(".toggle_tab.active");
  const pill = document.querySelector(".pill_indicator");
  if (activeTab && pill) {
    pill.style.width = `${activeTab.offsetWidth}px`;
    pill.style.left = `${activeTab.offsetLeft}px`;
  }
});

window.addEventListener("resize", () => {
  const activeTab = document.querySelector(".toggle_tab.active");
  if (activeTab && pill) {
    pill.style.width = `${activeTab.offsetWidth}px`;
    pill.style.left = `${activeTab.offsetLeft}px`;
  }
});







/**
 * mallDetail.js
 * -------------
 * What it does:
 * - Reads the "id" from the URL query (e.g. ?id=bugis-junction)
 * - Finds the corresponding mall from mallData.js using that ID
 * - Dynamically updates the HTML page with:
 *   - Mall name, description, MRT info
 *   - Background image for the header
 *   - List of all shops in the mall
 *   - Real time search functionality to filter shops
 *
 * Dependencies:
 * - mallData.js (exports the full mall directory list)
 *
 */
