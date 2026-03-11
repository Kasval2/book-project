const shelfContainer = document.getElementById('main-shelf');
const reloadBtn = document.getElementById('reload-btn');

// Элементы читалки
const reader = document.getElementById('reader-overlay');
const closeReader = document.getElementById('close-reader');
const pageContent = document.getElementById('page-content');
const pageNumText = document.getElementById('page-number');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');

let currentPage = 1;
const totalPages = 16;

async function loadBooks() {
    try {
        // Пробуем загрузить локальный файл. Если нужно из сети - вставь полную ссылку.
        const response = await fetch('books.json'); 
        if (!response.ok) throw new Error('Файл books.json не найден');
        const books = await response.json();
        renderLibrary(books);
    } catch (e) { 
        console.error(e);
        shelfContainer.innerHTML = `<div class="loading-status" style="color:red">Ошибка загрузки: ${e.message}</div>`;
    }
}

function renderLibrary(books) {
    if (!shelfContainer) return;
    shelfContainer.innerHTML = '';
    
    let currentShelf = document.createElement('div');
    currentShelf.className = 'shelf';
    shelfContainer.appendChild(currentShelf);

    books.forEach((book, index) => {
        if (index > 0 && index % 4 === 0) {
            currentShelf = document.createElement('div');
            currentShelf.className = 'shelf';
            shelfContainer.appendChild(currentShelf);
        }

        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <div class="book-cover" style="background: ${book.color || '#800000'}">
                <strong>${book.title}</strong>
            </div>
            <div class="book-reflection"></div>
        `;
        
        bookDiv.onclick = () => openBook(book.title);
        currentShelf.appendChild(bookDiv);
    });
}

function openBook(title) {
    document.getElementById('reader-book-title').innerText = title;
    currentPage = 1;
    updatePage();
    reader.classList.remove('reader-hidden');
    reader.classList.add('reader-visible');
}

function updatePage() {
    pageContent.innerText = `test${currentPage}`;
    pageNumText.innerText = `Страница ${currentPage} из ${totalPages}`;
}

// Кнопки управления (проверяем наличие элементов, чтобы не было ошибок)
if (closeReader) {
    closeReader.onclick = () => {
        reader.classList.remove('reader-visible');
        reader.classList.add('reader-hidden');
    };
}

if (nextBtn) {
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    };
}

if (prevBtn) {
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    };
}

if (reloadBtn) {
    reloadBtn.onclick = () => loadBooks();
}

// Запуск
loadBooks();