let addToy = false;
document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
    } else {
      toyForm.style.display = "none";
    }
  });

    fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy))
    })

  const collectionDiv = document.querySelector(`#toy-collection`)
  const submitToy = document.querySelector(`.add-toy-form`)

  //CREATE TOY
  submitToy.addEventListener("submit", event => {
    
    event.preventDefault()
    let nameInput = submitToy.querySelector(`[name='name']`)
    let imageInput = submitToy.querySelector(`[name='input']`)
    const toy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    }
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toy),
    })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy)
    })
    
    nameInput.value = ""
    imageInput.value = ""
  })

  //LIKE && DELETE
  collectionDiv.addEventListener("click", event => {
    const toyCard = event.target.closest(`.card`)
    if(event.target.className === "like-btn"){
      likes(toyCard)
    }
    else if(event.target.className === "delete-btn") {
      deletes(toyCard)
    }
  })

  function likes(toyCard){
      const toyId = toyCard.dataset.id
      const likesP = toyCard.querySelector(`p`)
      
      let likes = parseInt(likesP.textContent)
      likes += 1
      console.log(likes)

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({likes: likes}),
      })
      .then(response => response.json())
      .then(toy => {
        likesP.textContent = `${toy.likes} Likes`
      })
  }

  function deletes(toyCard) {
    const toyId = toyCard.dataset.id
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if(response.ok){
        toyCard.remove()
      }
    })
  }

  //RENDER TOY ONTO PAGE
  function renderToy({name, image, likes, id}) {
    const toyCard = document.createElement(`div`)
    toyCard.dataset.id = `${id}`
    toyCard.setAttribute('class', 'card')
    toyCard.innerHTML = `<h2>${name}</h2>
    <img src="${image}" class="toy-avatar" />
    <p>${likes} Likes </p>
    <button class="like-btn">Like <3</button>
    <button class="delete-btn">Delete</button>`

    collectionDiv.append(toyCard)
  }

});
