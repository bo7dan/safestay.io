document.addEventListener('DOMContentLoaded', function() {

    const hotelsData = [];
    const dealCards = document.querySelectorAll('.deal-card');
    
    dealCards.forEach(card => {
        const name = card.querySelector('h3').textContent.trim();
        const locationElement = card.querySelector('.location');
        const location = locationElement ? locationElement.textContent.replace(/\s*\S*\s*(.*)/, '$1').trim() : ''; 
        const priceText = card.querySelector('.price').textContent;
        const priceMatch = priceText.match(/\$([\d]+)/);
        const price = priceMatch ? parseInt(priceMatch[1]) : 0;
        const ratingElement = card.querySelector('.review');
        const ratingText = ratingElement ? ratingElement.textContent : '';
        const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
        const imageElement = card.querySelector('img');
        const image = imageElement ? imageElement.src : '';

        hotelsData.push({
            name: name,
            location: location,
            price: price,
            rating: rating,
            image: image
        });
    });

    console.log("Hotels loaded from HTML:", hotelsData);

    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show-menu'); 
        });
    }
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    
    if (checkInInput) {
        checkInInput.min = today; 
        
        checkInInput.addEventListener('change', function() {
            if (checkOutInput) {
                checkOutInput.min = this.value;
                if (checkOutInput.value < this.value) {
                    checkOutInput.value = this.value;
                }
            }
        });
    }
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const destination = document.getElementById('destination').value.trim().toLowerCase();
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = parseInt(document.getElementById('guests').value);
            const children = parseInt(document.getElementById('children').value); 
            const searchResults = hotelsData.filter(hotel => {
            const hotelLocationLower = hotel.location.toLowerCase();

            return destination === "" || hotelLocationLower.includes(destination); 
            });

            displaySearchResults(searchResults);
        });
    }
    
    function displaySearchResults(results) {
        const resultsGrid = document.querySelector('.search-results .results-grid');
        const noResultsMessage = document.querySelector('.search-results .no-results-message');
        const dealsSection = document.getElementById('deals-section');
        const destinationsSection = document.querySelector('.destinations');
        const searchResultsSection = document.querySelector('.search-results');

        resultsGrid.innerHTML = ''; 

        if (results.length === 0) {
            noResultsMessage.style.display = 'block';
            searchResultsSection.style.display = 'block';
            if (dealsSection) dealsSection.style.display = 'block';
            if (destinationsSection) destinationsSection.style.display = 'block';

        }
        
         else {
            noResultsMessage.style.display = 'none'; 
            searchResultsSection.style.display = 'block';

            if (dealsSection) dealsSection.style.display = 'none';
            if (destinationsSection) destinationsSection.style.display = 'none';
            results.forEach(hotel => {
                const card = `
                    <div class="deal-card"> 
                        <img src="${hotel.image}" alt="${hotel.name}">
                        <div class="deal-content">
                            <h3>${hotel.name}</h3>
                            <p class="location"><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
                            <p class="price">$${hotel.price} за ніч</p>
                            <p class="review"><i class="fas fa-star"></i> ${hotel.rating}</p>
                            <button class="book-btn" data-hotel-name="${hotel.name}">Забронюйте зараз</button>
                        </div>
                    </div>
                `;
                resultsGrid.insertAdjacentHTML('beforeend', card); 
            });
            const newBookButtons = resultsGrid.querySelectorAll('.book-btn');
            newBookButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const hotelName = this.dataset.hotelName;
                    alert(`Booking ${hotelName}. Redirecting to booking page...`);
                });
            });
        }
    }
    const bookButtons = document.querySelectorAll('.deal-card .book-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hotelName = this.closest('.deal-content').querySelector('h3').textContent;
            alert(`Booking ${hotelName}. Redirecting to booking page...`);
        });
    });
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            alert(`Logging in with email: ${email}`);
        });
    }
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('facebook-btn') ? 'Facebook' : 'Google';
            alert(`Redirecting to ${provider} login...`);
        });
    });

    const searchResultsSection = document.querySelector('.search-results');
    if (searchResultsSection) {
        searchResultsSection.style.display = 'none'; 
    }
});