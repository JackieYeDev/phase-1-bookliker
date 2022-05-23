const url = 'http://localhost:3000/books/';
const userID = 1;
let userJSON = ""

document.addEventListener("DOMContentLoaded", function() {
    const ul = document.querySelector('ul#list');
    // Initial fetch
    fetch(`http://localhost:3000/users/${userID}`)
        .then((res) => res.json())
        .then((data) => userJSON = data);

    fetch(url)
        .catch((err)=>console.error(err))
        .then((res) => res.json())
        .then((data) => {
            renderList(data, ul);
        });
});

function renderList(data, ul) {
    data.map((book) => {
        const entry = document.createElement('li');
        entry.innerText = book.title;
        entry.addEventListener('click', (e) => {
            e.preventDefault();
            renderBook(book);
        })
        ul.appendChild(entry);
    })
}

function renderBook(book) {
    const bookInfo = document.querySelector('div#show-panel');
    bookInfo.innerText = '';

    const img = document.createElement('img');
    const title = document.createElement('p');
    const subtitle = document.createElement('p')
    const author = document.createElement('p');
    const description = document.createElement('p');
    const users = document.createElement('ul');
    const likeButton = document.createElement('button');

    img.src = book.img_url;
    title.innerHTML = `<h4>${book.title}</h4>`
    subtitle.innerHTML = `<h4>${book.subtitle}</h4>`
    author.innerHTML = `<h4>${book.author}</h4>`
    description.innerText = `${book.description}`
    book.users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        users.append(li);
    });
    const lastUserEntry = Object.values(book.users).slice(-1)[0];
    const bookUserList = book.users;

    likeButton.innerText = lastUserEntry.id === userID?"UNLIKE":"LIKE";
    likeButton.addEventListener('click', (e) => {
        e.preventDefault();
        const patchData = lastUserEntry.id === userID?[...bookUserList].slice(0, -1):[...bookUserList, userJSON];
        updateUserLikeList(book.id, patchData);
        
    })

    bookInfo.append(img, title, subtitle, author, description, users, likeButton);
}
function updateUserLikeList(bookID, userData) {
    fetch(`http://localhost:3000/books/${bookID}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "users": userData
        })
    }).then((res) => res.json()).then((data)=> renderBook(data));
};