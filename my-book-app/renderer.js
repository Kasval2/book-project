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
        const response = await fetch('https://kasval2.github.io/book-project/my-book-app/books.json');
        const books = await response.json();
        renderLibrary(books);
    } catch (e) { console.error(e); }
}

function renderLibrary(books) {
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
            <div class="book-cover" style="background: ${book.color}">
                <strong>${book.title}</strong>
            </div>
            <div class="book-reflection"></div>
        `;
        
        // Клик по книге открывает читалку
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

// Кнопки управления
closeReader.onclick = () => {
    reader.classList.remove('reader-visible');
    reader.classList.add('reader-hidden');
};

nextBtn.onclick = () => {
    if (currentPage < totalPages) {
        currentPage++;
        updatePage();
    }
};

prevBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        updatePage();
    }
};

reloadBtn.onclick = () => loadBooks();
loadBooks();