const shelfContainer = document.getElementById('main-shelf');
const reloadBtn = document.getElementById('reload-btn');

// Настрой это позже:
const SERVER_URL = 'books.json'; 

async function loadBooks() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) throw new Error('Сервер недоступен');
        const books = await response.json();
        renderLibrary(books);
    } catch (error) {
        console.error('Ошибка:', error);
        shelfContainer.innerHTML = `<div class="loading-status">Ошибка: ${error.message}</div>`;
    }
}

function renderLibrary(books) {
    shelfContainer.innerHTML = ''; 
    
    let currentShelf = createShelf();
    shelfContainer.appendChild(currentShelf);

    books.forEach((book, index) => {
        // По 4 книги на одну полку
        if (index > 0 && index % 4 === 0) {
            currentShelf = createShelf();
            shelfContainer.appendChild(currentShelf);
        }

        const bookElement = document.createElement('div');
        bookElement.className = 'book';
        bookElement.innerHTML = `
            <div class="book-cover" style="background: ${book.color || '#800000'}">
                <strong>${book.title}</strong><br><small>${book.author}</small>
            </div>
            <div class="book-reflection"></div>
        `;
        currentShelf.appendChild(bookElement);
    });
}

function createShelf() {
    const shelf = document.createElement('div');
    shelf.className = 'shelf';
    return shelf;
}

reloadBtn.addEventListener('click', () => {
    // Анимация вращения кнопки
    reloadBtn.style.transition = 'transform 0.6s ease';
    reloadBtn.style.transform = 'rotate(360deg)';
    
    loadBooks();

    setTimeout(() => {
        reloadBtn.style.transition = 'none';
        reloadBtn.style.transform = 'rotate(0deg)';
    }, 600);
});

// Запуск при старте приложения
loadBooks();