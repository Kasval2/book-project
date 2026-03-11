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
let currentBookData = null; // Здесь храним данные открытой книги
let allBooks = []; // Список всех книг

async function loadBooks() {
    try {
        const response = await fetch('books.json'); 
        if (!response.ok) throw new Error('Файл books.json не найден');
        allBooks = await response.json();
        renderLibrary(allBooks);
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
        
        bookDiv.onclick = () => openBook(book.id);
        currentShelf.appendChild(bookDiv);
    });
}

function openBook(bookId) {
    // Находим книгу в списке по ID
    currentBookData = allBooks.find(b => b.id === bookId);
    
    if (currentBookData) {
        document.getElementById('reader-book-title').innerText = currentBookData.title;
        currentPage = 1;
        updatePage();
        reader.classList.remove('reader-hidden');
        reader.classList.add('reader-visible');
    }
}

function updatePage() {
    if (!currentBookData || !currentBookData.pages) {
        pageContent.innerText = "В этой книге нет страниц.";
        return;
    }

    // Отображаем текст текущей страницы
    const text = currentBookData.pages[currentPage - 1];
    pageContent.innerText = text || "Конец книги";
    
    // Обновляем номер страницы
    const total = currentBookData.pages.length;
    pageNumText.innerText = `Страница ${currentPage} из ${total}`;
}

// Кнопки управления
if (closeReader) {
    closeReader.onclick = () => {
        reader.classList.remove('reader-visible');
        reader.classList.add('reader-hidden');
    };
}

if (nextBtn) {
    nextBtn.onclick = () => {
        if (currentBookData && currentPage < currentBookData.pages.length) {
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

// Запуск приложения
loadBooks();