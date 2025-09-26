// Виправлення усіх помилок
// test github.dev
document.addEventListener('DOMContentLoaded', function() {

    const hotelsData = [];
    const dealCards = document.querySelectorAll('.deal-card');

    // Ця частина коду збирає дані про готелі зі статичного HTML.
    dealCards.forEach(card => {
        const name = card.querySelector('h3').textContent.trim();
        const locationElement = card.querySelector('.location');
        // Обробка відсутнього елемента location
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

    // Логіка для мобільного меню
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show-menu');
        });
    }

    // Логіка для вкладок пошуку
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Встановлення мінімальної дати для заїзду/виїзду
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

    // Обробка форми пошуку
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const destination = document.getElementById('destination').value.trim().toLowerCase();
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = parseInt(document.getElementById('guests').value);
            const children = parseInt(document.getElementById('children').value);

            // Фільтрація готелів на основі місця призначення
            const searchResults = hotelsData.filter(hotel => {
                const hotelLocationLower = hotel.location.toLowerCase();
                // Якщо поле пошуку порожнє, показуємо всі готелі.
                return destination === "" || hotelLocationLower.includes(destination);
            });

            displaySearchResults(searchResults);
        });
    }

    // Функція для відображення результатів пошуку
    function displaySearchResults(results) {
        const resultsGrid = document.querySelector('.search-results .results-grid');
        const noResultsMessage = document.querySelector('.search-results .no-results-message');
        const dealsSection = document.getElementById('deals-section');
        const destinationsSection = document.querySelector('.destinations');
        const searchResultsSection = document.querySelector('.search-results');

        resultsGrid.innerHTML = ''; // Очищаємо попередні результати

        if (results.length === 0) {
            noResultsMessage.style.display = 'block';
            searchResultsSection.style.display = 'block';
            // Показуємо всі секції, якщо результатів немає, що логічно для користувача.
            if (dealsSection) dealsSection.style.display = 'block';
            if (destinationsSection) destinationsSection.style.display = 'block';

        } else {
            noResultsMessage.style.display = 'none';
            searchResultsSection.style.display = 'block';

            // Ховаємо секції 'deals' та 'destinations', якщо є результати.
            if (dealsSection) dealsSection.style.display = 'none';
            if (destinationsSection) destinationsSection.style.display = 'none';

            // Динамічне створення карток з результатами
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

            // Додаємо обробники подій для нових кнопок, доданих після пошуку
            addBookButtonListeners();
        }
    }

    // Функція для обробки кнопок "Забронюйте зараз"
    // Замість 'alert' використовуємо власне модальне вікно.
    function addBookButtonListeners() {
        const bookButtons = document.querySelectorAll('.book-btn');
        bookButtons.forEach(button => {
            button.addEventListener('click', function() {
                const hotelName = this.dataset.hotelName || this.closest('.deal-content').querySelector('h3').textContent;
                showCustomAlert(`Бронювання ${hotelName}. Перехід на сторінку бронювання...`);
            });
        });
    }

    // Обробник для форм авторизації та соціальних кнопок
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showCustomAlert(`Вхід за допомогою: ${email}`);
        });
    }

    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('facebook-btn') ? 'Facebook' : 'Google';
            showCustomAlert(`Перехід на сторінку входу через ${provider}...`);
        });
    });

    // Спочатку додаємо обробники для існуючих кнопок
    addBookButtonListeners();

    // Заміна 'alert' на кастомний модальний елемент.
    function showCustomAlert(message) {
        // Створюємо елемент модального вікна
        const alertModal = document.createElement('div');
        alertModal.className = 'custom-alert-modal';
        alertModal.innerHTML = `
            <div class="custom-alert-content">
                <p>${message}</p>
                <button class="custom-alert-close">OK</button>
            </div>
        `;
        document.body.appendChild(alertModal);

        // Додаємо стилі для модального вікна
        const style = document.createElement('style');
        style.innerHTML = `
            .custom-alert-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .custom-alert-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                min-width: 250px;
                color: #333;
            }
            .custom-alert-close {
                margin-top: 15px;
                padding: 8px 20px;
                border: none;
                border-radius: 5px;
                background-color: #007bff;
                color: white;
                cursor: pointer;
            }
            .custom-alert-close:hover {
                background-color: #0056b3;
            }
        `;
        document.head.appendChild(style);

        // Обробник для закриття модального вікна
        alertModal.querySelector('.custom-alert-close').addEventListener('click', () => {
            document.body.removeChild(alertModal);
            document.head.removeChild(style);
        });
    }

    // Спочатку приховуємо секцію результатів, щоб вона не показувалася при завантаженні сторінки
    const searchResultsSection = document.querySelector('.search-results');
    if (searchResultsSection) {
        searchResultsSection.style.display = 'none';
    }
});
