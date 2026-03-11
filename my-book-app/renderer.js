const shelfContainer = document.getElementById('main-shelf');
const likeBtn = document.getElementById('edit-btn'); // Кнопка "Нравится"
const collectionsBtn = document.getElementById('collections-btn'); // Кнопка "Коллекции"

let allBooks = [];
let isLikeMode = false;
let currentFilter = 'all'; // 'all' или 'favorites'

// Загрузка книг
async function loadBooks() {
    try {
        const response = await fetch('books.json');
        allBooks = await response.json();
        // Добавляем свойство favorite, если его нет
        allBooks = allBooks.map(b => ({ ...b, favorite: b.favorite || false }));
        renderLibrary();
    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
}

// Рендер библиотеки
function renderLibrary() {
    shelfContainer.innerHTML = '';
    
    // Сортируем: если фильтр "favorites", то любимые в начале
    let displayBooks = [...allBooks];
    if (currentFilter === 'favorites') {
        displayBooks.sort((a, b) => b.favorite - a.favorite);
    }

    let currentShelf = document.createElement('div');
    currentShelf.className = 'shelf';
    shelfContainer.appendChild(currentShelf);

    displayBooks.forEach((book, index) => {
        if (index > 0 && index % 4 === 0) {
            currentShelf = document.createElement('div');
            currentShelf.className = 'shelf';
            shelfContainer.appendChild(currentShelf);
        }

        const bookDiv = document.createElement('div');
        bookDiv.className = `book ${book.favorite ? 'is-favorite' : ''}`;
        bookDiv.innerHTML = `
            <div class="heart-badge">❤️</div>
            <div class="book-cover" style="background: ${book.color}">
                <strong>${book.title}</strong>
            </div>
            <div class="book-reflection"></div>
        `;

        bookDiv.onclick = () => {
            if (isLikeMode) {
                // Переключаем статус "любимая"
                book.favorite = !book.favorite;
                // Находим эту же книгу в основном массиве и обновляем
                const mainBook = allBooks.find(b => b.id === book.id);
                mainBook.favorite = book.favorite;
                renderLibrary();
            } else {
                openBook(book.id);
            }
        };

        currentShelf.appendChild(bookDiv);
    });
}

// Кнопка "Нравится" (бывшая "Правка")
if (likeBtn) {
    likeBtn.innerText = "Нравится";
    likeBtn.onclick = () => {
        isLikeMode = !isLikeMode;
        likeBtn.innerText = isLikeMode ? "Готово" : "Нравится";
        likeBtn.style.background = isLikeMode ? "linear-gradient(to bottom, #ff5e5e, #ff3b30)" : "";
        shelfContainer.classList.toggle('like-mode');
    };
}

// Кнопка "Коллекции"
if (collectionsBtn) {
    collectionsBtn.onclick = () => {
        if (currentFilter === 'all') {
            currentFilter = 'favorites';
            collectionsBtn.innerText = "❤ Понравились";
        } else {
            currentFilter = 'all';
            collectionsBtn.innerText = "Коллекции";
        }
        renderLibrary();
    };
}

// Остальные функции (openBook, updatePage и т.д.) остаются такими же, как были
function openBook(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (book) {
        document.getElementById('reader-book-title').innerText = book.title;
        currentPage = 1;
        currentBookData = book;
        updatePage();
        document.getElementById('reader-overlay').classList.replace('reader-hidden', 'reader-visible');
    }
}

let currentPage = 1;
let currentBookData = null;

function updatePage() {
    const pageContent = document.getElementById('page-content');
    const pageNumText = document.getElementById('page-number');
    if (!currentBookData) return;
    pageContent.innerText = currentBookData.pages[currentPage - 1] || "Конец";
    pageNumText.innerText = `Страница ${currentPage} из ${currentBookData.pages.length}`;
}

document.getElementById('close-reader').onclick = () => {
    document.getElementById('reader-overlay').classList.replace('reader-visible', 'reader-hidden');
};

document.getElementById('next-page').onclick = () => {
    if (currentPage < currentBookData.pages.length) { currentPage++; updatePage(); }
};

document.getElementById('prev-page').onclick = () => {
    if (currentPage > 1) { currentPage--; updatePage(); }
};

loadBooks();