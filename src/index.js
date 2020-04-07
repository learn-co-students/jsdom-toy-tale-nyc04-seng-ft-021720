let addToy = false;


document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  const toyCollectionDiv = document.querySelector("#toy-collection")
  const button = document.querySelector('like-btn')

  // Event Listeners
  toyForm.addEventListener("submit", e => {
    e.preventDefault()

    const toyNameInput = document.querySelector("#name-input")
    const toyImageInput = document.querySelector("#image-input")

    const newToy = {
      "name": toyNameInput.value,
      "image": toyImageInput.value,
      "likes": 0
    }

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toyObj) => {
        renderToy(toyObj)
      })

    e.target.reset()
  })

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
    } else {
      toyForm.style.display = "none";
    }
  });

  // Render Helper
  function renderToy(toyObj) {
    const toyDiv = document.createElement("div")
    toyDiv.className = "card"

    toyDiv.innerHTML = `
    <h2>${toyObj.name}</h2>
    <img src=${toyObj.image} class="toy-avatar" />
    <p>${toyObj.likes} Likes </p>
    ` 
    const likesP = toyDiv.querySelector('p')
    const button = document.createElement("button")
    button.textContent = `Like <3`
    button.className = "like-btn"

    button.addEventListener("click", e => {
      toyObj.likes++
      likesP.textContent = `${toyObj.likes} Likes`
      
      fetch(`http://localhost:3000/toys/${toyObj.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: toyObj.likes
        }),
      })
      
    })

    toyDiv.append(button)
    toyCollectionDiv.append(toyDiv)
  }

  fetch("http://localhost:3000/toys")
    .then(r => r.json())
    .then(toyArray => {
      toys = toyArray
      toyArray.forEach(renderToy)
    })
});
