// Definicja URL-i dla stron
const pageUrls = {
    home: '/index.html?home',
    gallery: '/index.html?gallery',
    contact: '/index.html?contact'
};

// Zawartość stron jako szablony HTML
const pageTemplates = {
    home: `
        <h2 class="title">Witaj świecie!</h2>
        <p>Witaj na mojej stronie! Znajdziesz tu:</p>
        <ul>
            <li>Galerię zdjęć</li>
            <li>Formularz kontaktowy</li>
        </ul>
        <p>Zapraszam do przeglądania!</p>
    `,
    gallery: `
        <h2 class="title">Galeria</h2>
        <div class="gallery-content">
            <h3>Galeria zdjęć z Kolumbii</h3>
            <p>Witaj w mojej galerii zdjęć z podróży po Kolumbii. Poniżej znajdziesz zdjęcia z różnych miast i regionów tego pięknego kraju.</p>
            
            <div class="gallery-container">
                <!-- Tutaj będą dynamicznie dodawane zdjęcia -->
            </div>
            
            <div id="gallery-loader" class="gallery-loader">Ładowanie zdjęć...</div>
        </div>
    `,
    contact: `
        <h2 class="title">Kontakt</h2>

        <form id="contact-form">
            <label for="fullname">Imię i nazwisko:</label>
            <input type="text" id="fullname" name="fullname" required>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            
            <label for="subject">Temat:</label>
            <input type="text" id="subject" name="subject" required>
            
            <label for="content">Wiadomość:</label>
            <textarea id="content" name="content" required></textarea>
            
            <button type="submit">Wyślij wiadomość</button>
        </form>
    `
};

// Funkcja do ładowania stron
function loadPage(pageKey) {
    // Pokaż wskaźnik ładowania
    const loadingElement = document.getElementById('page-loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    try {
        // Aktualizuj tytuł strony
        document.title = getPageTitle(pageKey);
        
        // Wstaw zawartość do kontenera
        const contentElement = document.getElementById('content');
        if (contentElement) {
            contentElement.innerHTML = pageTemplates[pageKey] || 'Strona nie została znaleziona';
        }
        
        // Inicjalizuj funkcje specyficzne dla danej strony
        initPageSpecificFunctions(pageKey);
        
    } catch (error) {
        console.error('Błąd ładowania strony:', error);
        const contentElement = document.getElementById('content');
        if (contentElement) {
            contentElement.innerHTML = `
                <h2 class="title">Błąd ładowania strony</h2>
                <p>Przepraszamy, wystąpił błąd podczas ładowania strony.</p>
                <p>${error.message}</p>
            `;
        }
    } finally {
        // Ukryj wskaźnik ładowania
        const loadingElement = document.getElementById('page-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Funkcja zwracająca tytuł strony
function getPageTitle(pageKey) {
    const titles = {
        home: 'Strona główna',
        gallery: 'Galeria',
        contact: 'Kontakt'
    };
    
    return titles[pageKey] || 'Portfolio SPA';
}

// Funkcja inicjalizująca funkcje specyficzne dla danej strony
function initPageSpecificFunctions(pageKey) {
    switch (pageKey) {
        case 'gallery':
            // Inicjalizacja galerii jest w oddzielnym pliku gallery.js
            if (typeof initGallery === 'function') {
                initGallery();
            }
            break;
        case 'contact':
            initContact();
            break;
    }
}

// Inicjalizacja formularza kontaktowego
function initContact() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Formularz został wysłany!');
            form.reset();
        });
    }
}

// Obsługa nawigacji przeglądarki (przyciski wstecz/dalej)
function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
    let pageKey = 'home';
    
    if (loc === pageUrls.home || loc === '/index.html' || loc === '/' || loc === '') { 
        pageKey = 'home';
    } else if (loc === pageUrls.gallery || loc === '?gallery') { 
        pageKey = 'gallery';
    } else if (loc === pageUrls.contact || loc === '?contact') { 
        pageKey = 'contact';
    }
    
    loadPage(pageKey);
}

// Nasłuchiwacze zdarzeń dla linków nawigacyjnych
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#home-link').addEventListener('click', (event) => {
        let stateObj = { page: 'home' };
        history.pushState(stateObj, "home", "?home");
        loadPage('home');
    });

    document.querySelector('#gallery-link').addEventListener('click', (event) => {
        let stateObj = { page: 'gallery' };
        history.pushState(stateObj, "gallery", "?gallery");
        loadPage('gallery');
    });

    document.querySelector('#contact-link').addEventListener('click', (event) => {
        let stateObj = { page: 'contact' };
        history.pushState(stateObj, "contact", "?contact");
        loadPage('contact');
    });

    // Obsługa przełącznika motywu
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Zapisanie preferencji motywu w localStorage
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
    }
});

// Załadowanie zapisanych preferencji motywu
function loadThemePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Nasłuchiwacz zdarzenia popstate
window.onpopstate = popStateHandler;

// Inicjalizacja aplikacji
function init() {
    popStateHandler();
    loadThemePreference();
}

// Uruchomienie inicjalizacji po załadowaniu dokumentu
document.addEventListener('DOMContentLoaded', init);