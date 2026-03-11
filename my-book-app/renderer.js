const shelfContainer = document.getElementById('main-shelf');
const reloadBtn = document.getElementById('reload-btn');
const likeBtn = document.getElementById('edit-btn'); 
const collectionsBtn = document.getElementById('collections-btn'); 

let allBooks = [];
let isLikeMode = false;
let currentFilter = 'all'; // 'all' или 'favorites'
let currentPage = 1;
let currentBookData = null;

// Загрузка книг
async function loadBooks() {
    try {
        // Показываем статус загрузки
        shelfContainer.innerHTML = '<div class="loading-status">Загрузка библиотеки...</div>';
        
        const response = await fetch('books.json');
        if (!response.ok) throw new Error('Не удалось загрузить books.json');
        
        const data = await response.json();
        
        // Перезаписываем массив новыми данными и добавляем поле favorite
        allBooks = data.map(b => ({ ...b, favorite: b.favorite || false }));
        
        renderLibrary();
    } catch (e) {
        console.error("Ошибка загрузки:", e);
        shelfContainer.innerHTML = `<div class="loading-status" style="color:red">Ошибка: ${e.message}</div>`;
    }
}

// Рендер библиотеки
function renderLibrary() {
    if (!shelfContainer) return;
    shelfContainer.innerHTML = '';
    
    let displayBooks = [...allBooks];
    
    // Если включен фильтр избранного
    if (currentFilter === 'favorites') {
        displayBooks.sort((a, b) => b.favorite - a.favorite);
    }

    let currentShelf = document.createElement('div');
    currentShelf.className = 'shelf';
    shelfContainer.appendChild(currentShelf);

    displayBooks.forEach((book, index) => {
        // Каждые 4 книги создаем новую полку
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
                book.favorite = !book.favorite;
                // Синхронизируем статус в основном массиве
                const mainBook = allBooks.find(b => b.id === book.id);
                if (mainBook) mainBook.favorite = book.favorite;
                renderLibrary();
            } else {
                openBook(book.id);
            }
        };

        currentShelf.appendChild(bookDiv);
    });
}

// Кнопка "Нравится"
if (likeBtn) {
    likeBtn.onclick = () => {
        isLikeMode = !isLikeMode;
        likeBtn.innerText = isLikeMode ? "Готово" : "Нравится";
        // Визуальный акцент на кнопке в режиме лайков
        likeBtn.style.textShadow = isLikeMode ? "0 0 5px white" : "";
        shelfContainer.classList.toggle('like-mode');
    };
}

// Кнопка "Коллекции" (Фильтр)
if (collectionsBtn) {
    collectionsBtn.onclick = () => {
        if (currentFilter === 'all') {
            currentFilter = 'favorites';
            collectionsBtn.innerText = "⭐ Избранное";
        } else {
            currentFilter = 'all';
            collectionsBtn.innerText = "Коллекции";
        }
        renderLibrary();
    };
}

// ИСПРАВЛЕННАЯ Кнопка перезагрузки
if (reloadBtn) {
    reloadBtn.onclick = () => {
        // Сбрасываем режимы перед перезагрузкой
        isLikeMode = false;
        currentFilter = 'all';
        if (likeBtn) {
            likeBtn.innerText = "Нравится";
            likeBtn.style.textShadow = "";
        }
        if (collectionsBtn) collectionsBtn.innerText = "Коллекции";
        shelfContainer.classList.remove('like-mode');
        
        // Грузим данные заново
        loadBooks();
    };
}

// Логика читалки
function openBook(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (book) {
        currentBookData = book;
        document.getElementById('reader-book-title').innerText = book.title;
        currentPage = 1;
        updatePage();
        document.getElementById('reader-overlay').classList.replace('reader-hidden', 'reader-visible');
    }
}

function updatePage() {
    const pageContent = document.getElementById('page-content');
    const pageNumText = document.getElementById('page-number');
    if (!currentBookData || !currentBookData.pages) return;
    
    pageContent.innerText = currentBookData.pages[currentPage - 1] || "Конец книги";
    pageNumText.innerText = `Страница ${currentPage} из ${currentBookData.pages.length}`;
}

// Кнопки управления читалкой
document.getElementById('close-reader').onclick = () => {
    document.getElementById('reader-overlay').classList.replace('reader-visible', 'reader-hidden');
};

document.getElementById('next-page').onclick = () => {
    if (currentBookData && currentPage < currentBookData.pages.length) {
        currentPage++;
        updatePage();
    }
};

document.getElementById('prev-page').onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        updatePage();
    }
};

// Первый запуск
loadBooks();