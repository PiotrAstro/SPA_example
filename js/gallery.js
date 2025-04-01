// Zmienna przechowująca aktualną stronę galerii
let currentPage = 1;
// Ilość zdjęć ładowanych w jednym żądaniu
const photosPerPage = 4;
// Flaga informująca, czy wszystkie zdjęcia zostały już załadowane
let allPhotosLoaded = false;
// Flaga informująca, czy aktualnie trwa ładowanie zdjęć
let isLoading = false;

const allImages = [
    { src: 'images/gallery/1.jpg', title: 'Colombia - Bogota' },
    { src: 'images/gallery/2.jpg', title: 'Colombia - Bogota' },
    { src: 'images/gallery/3.jpg', title: 'Colombia - Bogota' },
    { src: 'images/gallery/4.jpg', title: 'Colombia - Paramo' },
    { src: 'images/gallery/5.jpg', title: 'Colombia - Bogota' },
    { src: 'images/gallery/6.jpg', title: 'Colombia - Paramo' },
    { src: 'images/gallery/7.jpg', title: 'Colombia - Aipe' },
    { src: 'images/gallery/8.JPG', title: 'Colombia - Tatacoa' },
    { src: 'images/gallery/9.jpg', title: 'Colombia - Orion' },
    { src: 'images/gallery/10.jpg', title: 'Colombia - Tatacoa' },
    { src: 'images/gallery/11.jpg', title: 'Colombia - Salento' },
    { src: 'images/gallery/12.jpg', title: 'Colombia - Salento' },
    { src: 'images/gallery/13.JPG', title: 'Colombia - Paramo' },
    { src: 'images/gallery/14.JPG', title: 'Colombia - Valle de Cocora' },
    { src: 'images/gallery/15.jpg', title: 'Colombia - Salento' },
];


// Główna funkcja inicjalizacji galerii
function initGallery() {
    console.log('Inicjalizacja galerii...');
    // Resetujemy zmienne przy każdym załadowaniu galerii
    currentPage = 1;
    allPhotosLoaded = false;
    isLoading = false;
    
    // Tworzymy kontener na zdjęcia, jeśli jeszcze nie istnieje
    let galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        // Jeśli kontener już istnieje, czyścimy go
        galleryContainer.innerHTML = '';
    }
    
    // Dodajemy element ładowania na końcu galerii
    let galleryLoader = document.getElementById('gallery-loader');
    if (galleryLoader) {
        galleryLoader.style.display = 'none';
    }
    
    // Ładujemy pierwszą partię zdjęć
    loadGalleryImages();
    
    // Dodajemy obserwator przewijania dla infinite scroll
    setupInfiniteScroll();
}

// Funkcja do asynchronicznego ładowania zdjęć
async function loadGalleryImages() {
    // Jeśli już wszystkie zdjęcia są załadowane lub trwa ładowanie, przerwij
    if (allPhotosLoaded || isLoading) return;
    
    // Ustaw flagę ładowania
    isLoading = true;
    
    // Pokaż wskaźnik ładowania
    const galleryLoader = document.getElementById('gallery-loader');
    if (galleryLoader) {
        galleryLoader.style.display = 'block';
    }
    
    try {
        // Symulujemy opóźnienie asynchronicznego ładowania
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Symulujemy pobieranie listy plików z folderu
        const images = getGalleryImages(currentPage, photosPerPage);
        
        if (images.length === 0) {
            allPhotosLoaded = true;
            if (galleryLoader) {
                galleryLoader.textContent = 'Wszystkie zdjęcia załadowane';
                // Po chwili ukrywamy komunikat
                setTimeout(() => {
                    galleryLoader.style.display = 'none';
                }, 2000);
            }
            return;
        }
        
        // Dodajemy zdjęcia do galerii
        const galleryContainer = document.querySelector('.gallery-container');
        
        if (galleryContainer) {
            images.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = image.title;
                img.loading = 'lazy'; // Natywne leniwe ładowanie obrazków
                
                const caption = document.createElement('div');
                caption.className = 'gallery-caption';
                caption.textContent = image.title;
                
                galleryItem.appendChild(img);
                galleryItem.appendChild(caption);
                galleryContainer.appendChild(galleryItem);
                
                // Dodanie nasłuchiwacza zdarzeń do powiększania obrazka
                galleryItem.addEventListener('click', () => {
                    showLightbox(image.src, image.title);
                });
            });
        }
        
        // Zwiększamy numer strony dla następnego ładowania
        currentPage++;
        
    } catch (error) {
        console.error('Błąd ładowania zdjęć:', error);
        const galleryContainer = document.querySelector('.gallery-container');
        if (galleryContainer) {
            galleryContainer.innerHTML += `
                <div class="error-message">
                    <p>Błąd ładowania zdjęć. Spróbuj ponownie później.</p>
                </div>
            `;
        }
    } finally {
        // Ustaw flagę ładowania na false
        isLoading = false;
        
        // Ukryj wskaźnik ładowania, jeśli nie wszystkie zdjęcia są załadowane
        if (!allPhotosLoaded) {
            const galleryLoader = document.getElementById('gallery-loader');
            if (galleryLoader) {
                galleryLoader.style.display = 'none';
            }
        }
    }
}

// Funkcja konfigurująca infinite scroll
function setupInfiniteScroll() {
    // Sprawdzenie czy jesteśmy na stronie galerii
    if (!document.querySelector('.gallery-container')) return;
    
    // Używamy Intersection Observer API jeśli jest dostępne
    if ('IntersectionObserver' in window) {
        // Tworzymy obserwator przewijania
        const observer = new IntersectionObserver((entries) => {
            // Sprawdzamy, czy element ładowania jest widoczny
            if (entries[0].isIntersecting && !isLoading && !allPhotosLoaded) {
                loadGalleryImages();
            }
        }, {
            // Opcje obserwatora - ładuj, gdy element jest 100px od dolnej krawędzi widoku
            rootMargin: '0px 0px 100px 0px'
        });
        
        // Obserwuj element ładowania
        const galleryLoader = document.getElementById('gallery-loader');
        if (galleryLoader) {
            observer.observe(galleryLoader);
        }
    }
    
    // Dodatkowe sprawdzenie przewijania (dla kompatybilności)
    window.addEventListener('scroll', () => {
        // Sprawdzamy czy jesteśmy na stronie galerii
        if (!document.querySelector('.gallery-container')) return;
        
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            if (!isLoading && !allPhotosLoaded) {
                loadGalleryImages();
            }
        }
    });
}

// Funkcja symulująca pobieranie zdjęć
function getGalleryImages(page, limit) {    
    // Obliczenie indeksów dla paginacji
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Zwrócenie podzbioru obrazów dla danej strony
    return allImages.slice(startIndex, endIndex);
}

// Funkcja tworząca lightbox z wykorzystaniem klas CSS
function showLightbox(src, alt) {
    // Tworzenie elementów lightboxa
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    // Tworzenie elementu obrazu
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    
    // Tworzenie przycisku zamknięcia
    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Zamknij');
    
    // Dodanie elementów do lightboxa
    lightbox.appendChild(img);
    lightbox.appendChild(closeButton);
    
    // Dodanie lightboxa do body
    document.body.appendChild(lightbox);
    
    // Blokada przewijania strony gdy lightbox jest otwarty
    document.body.style.overflow = 'hidden';
    
    // Zamykanie lightboxa po kliknięciu przycisku lub tła
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Dodanie obsługi klawisza Escape
    document.addEventListener('keydown', handleEscapeKey);
    
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
    
    function closeLightbox() {
        document.body.removeChild(lightbox);
        document.body.style.overflow = ''; // Przywrócenie przewijania
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

// Inicjalizacja galerii przy załadowaniu dokumentu
document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja galerii nastąpi w router.js przez initPageSpecificFunctions
});