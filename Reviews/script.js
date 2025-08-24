function initReviewsPage() {
    const sortSelect = document.getElementById('sort-by');
    const filterSelect = document.getElementById('rating-filter');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Sorting by:', this.value);
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            console.log('Filtering by rating:', this.value);
        });
    }
    
    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentCount = parseInt(this.textContent.match(/\d+/)[0]);
            this.innerHTML = `<i class="far fa-thumbs-up"></i> Helpful (${currentCount + 1})`;
            this.style.color = '#003580';
            this.disabled = true;
        });
    });
    
    const paginationButtons = document.querySelectorAll('.pagination-btn:not(.next)');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            console.log('Loading page:', this.textContent);
        });
    });
}

if (document.querySelector('.reviews-section')) {
    initReviewsPage();
}