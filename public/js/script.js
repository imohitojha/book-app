const bookForm = document.getElementById('book-form');
const cardsGroup = document.querySelector('.cards-group');
const fictionDiv = document.getElementById('fiction');
const mythicalDiv = document.getElementById('mythical');
const romanceDiv = document.getElementById('romance');
const horrorDiv = document.getElementById('horror');
const submitButton = document.getElementById('submit-button');

let bookName = document.getElementById('name');
let genre = document.getElementById('genre');
let price = document.getElementById('price');
let counter = 1;

fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(data => {
        data.sort((book1, book2) => book2.likes - book1.likes);
        data.forEach(book => {
            const card = `<div class="card col-4" style="width: 18rem;">
            <div class="card-body" data-id=${book.id}>
                <h5 class="card-title">${book.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${book.genre}</h6>
                <p class="card-text">${book.price}</p>
                <button class="btn btn-info" id="edit-button">Edit</button>
                <button class="btn btn-danger" id="delete-button">Delete</button>
                <br />
                <button class="btn btn-primary mt-1" id="like-button">Like</button>
                <span id="likes">${book.likes}</span>
            </div>
        </div>`;
        if(book.genre === 'Fiction') {
            document.getElementById('fictionLabel').style.display = 'block';
            fictionDiv.innerHTML += card;
        } else if(book.genre === 'Mythical') {
            document.getElementById('mythicalLabel').style.display = 'block';
            mythicalDiv.innerHTML += card;
        } else if(book.genre === 'Romance') {
            document.getElementById('romanceLabel').style.display = 'block';
            romanceDiv.innerHTML += card;
        } else if(book.genre === 'Horror') {
            document.getElementById('horrorLabel').style.display = 'block';
            horrorDiv.innerHTML += card;
        }
        if(counter <=5 ) {
            const ul = document.querySelector('.dropdown-menu');
            const li = `<li><a class="dropdown-item" href="#">${book.name}</a></li>`;
            ul.innerHTML += li;
        }
        counter++;
        });
    });


bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (bookName.value === '' || genre.value === '' || price.value === '') {
        showAlerts('Please fill in all details...', 'danger');
    } else {
        const data = {
            "name": bookName.value,
            "genre": genre.value,
            "price": price.value,
            "likes": 0
        };
        fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(resp => resp.json())
            .catch(error => new Error(error));

        showAlerts('Book Added', 'success');
        bookName.value = '';
        genre.value = '';
        price.value = '';
    }
});

const showAlerts = (message, className) => {
    // CREATE ALERT DIV WITH ALL NECESSARY PROPERTIES
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    // ADD MESSAGE TO THIS DIV
    div.appendChild(document.createTextNode(message));
    // ADD DIV TO DOM
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
};

cardsGroup.addEventListener('click', (e) => {
    e.preventDefault();
    let delButtonIsPressed = e.target.id === 'delete-button';
    let editButtonIsPressed = e.target.id === 'edit-button';
    let likeButtonIsPressed = e.target.id === 'like-button';

    let id = e.target.parentElement.dataset.id;

    if(delButtonIsPressed) {
        fetch(`http://localhost:3000/books/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => location.reload())
    }

    const parent = e.target.parentElement;
    let bookTitle = parent.querySelector('.card-title').textContent;
    let bookGenre = parent.querySelector('.card-subtitle').textContent;
    let bookPrice = parent.querySelector('.card-text').textContent;
    let bookLikes = Number(parent.querySelector('#likes').textContent);

    if(editButtonIsPressed) {
        bookName.value = bookTitle;
        genre.value = bookGenre;
        price.value = bookPrice;
    }

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/books/${id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: bookName.value,
                genre: genre.value,
                price: price.value,
                likes: bookLikes
            })
        })
        .then(res => res.json())
        .then(() => location.reload())
    });
    
    if(likeButtonIsPressed) {
        console.log(bookLikes);
        bookLikes += 1;
        fetch(`http://localhost:3000/books/${id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: bookTitle,
                genre: bookGenre,
                price: bookPrice,
                likes: bookLikes
            })
        })
        .then(res => res.json())
        .then(() => location.reload())
    }
});
