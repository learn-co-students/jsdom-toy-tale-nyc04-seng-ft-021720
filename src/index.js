let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  function renderToy(toy){
    const toyCard = document.createElement("div")
    toyCard.classList.add("card")
    toyCard.setAttribute("id", toy.id)
    toyCard.innerHTML = `
    <h2>${toy.name}</h2><br />
    <img style="height:200px;max-width:200px;width: expression(this.width > 500 ? 500: true);" src=${toy.image} /><br />
    <p id='toy-likes'>${toy.likes} Likes </p><button class='like-btn'>Like <3</button>
    `
    toyCard.querySelector('.like-btn').addEventListener("click", e =>{
      // getting the likes from the toy card we clicked on and incrementing
      let likeInt = parseInt(e.target.parentNode.querySelector("#toy-likes").innerText.split(" ")[0])
      likeInt ++
      // debugger
      fetch(`http://localhost:3000/toys/${parseInt(e.target.parentNode.id)}`,{
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "likes": likeInt
        })
      })
        .then(response => response.json())
        .then(json => {
          const currentToy = document.getElementById(json.id)
          currentToy.querySelector("#toy-likes").innerText = `${likeInt} Likes`
        })
    })
    toyCollection.append(toyCard)
  }

  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(json => {
      json.forEach(toy => {
        renderToy(toy)
      })
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

  // Adding a new toy

  // first we find the form that we want to listen on for the post request
  // then we add an event listener for submit
  document.querySelector(".add-toy-form").addEventListener("submit", e => {
    // need to start by preventing default behavior on the form to prevent a refresh once the button is clicked
    e.preventDefault()
    // next we set a constant for a new toy object to be added later.
    // this form has input fields for a name and an image, and we know likes should default to 0
    // so we create keys for those in the object and assign them to the values of those input fields and 0
    const newToy = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0        
    }
    // next we make the fetch request to save the data.
    // the form is on the /toys route, so we want that same URL
    fetch("http://localhost:3000/toys", {
      // unless we specify to use POST, fetch will default to a GET request
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      },
      // renderToy takes a string, so we use JSON.stringify() to convert the json object into a string
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(renderToy(newToy))
  })

// Increasing likes
  // document.querySelector(".")

});

