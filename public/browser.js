const itemTemplate = item => {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`;
};

// Initial Page Load Render
const ourHTML = items
  .map(item => {
    return itemTemplate(item);
  })
  .join('');
document.getElementById('item-list').insertAdjacentHTML('beforeend', ourHTML);

// Create Feature
let createForm = document.getElementById('create-form');
let createField = document.getElementById('create-field');
let itemList = document.getElementById('item-list');

createForm.addEventListener('submit', function (e) {
  e.preventDefault();
  axios
    .post('/create-item', {
      text: createField.value,
    })
    .then(function (response) {
      itemList.insertAdjacentHTML('beforeend', itemTemplate(response.data));
      createField.value = '';
      createField.focus();
    })
    .catch(function () {
      console.log('Please try again later.');
    });
});

// Update and Delete Features
document.addEventListener('click', e => {
  // Update
  if (e.target.classList.contains('edit-me')) {
    let itemTextEl =
      e.target.parentElement.parentElement.querySelector('.item-text');
    let itemTextVal = itemTextEl.textContent; // bude predvyplneno pole v Promptu
    let userInput = prompt('Enter your desired new text', itemTextVal);
    // IF zamezi to poslani null pri kliknuti na Cancel
    if (userInput) {
      axios
        .post('/update-item', {
          text: userInput,
          id: e.target.getAttribute('data-id'),
        })
        .then(function () {
          itemTextEl.innerHTML = userInput; // po odeslani do db se nahradi text
        })
        .catch(function () {
          console.log('Please try again later.');
        });
    }
  }
  // Delete
  if (e.target.classList.contains('delete-me')) {
    if (confirm('Do you really want to delete it?')) {
      axios
        .post('/delete-item', {
          id: e.target.getAttribute('data-id'),
        })
        .then(function () {
          e.target.parentElement.parentElement.remove();
        })
        .catch(function () {
          console.log('Please try again later.');
        });
    }
  }
});
