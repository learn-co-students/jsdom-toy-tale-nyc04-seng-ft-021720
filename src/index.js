let addToy = false;
let toyContainer = document.querySelector('#toy-collection')
let addToyForm = document.querySelector('.add-toy-form')
let toyNameSubmit = addToyForm.querySelector("[name=name]")
let toyLinkSubmit = addToyForm.querySelector("[name=image]")



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
});



fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(output => {
    output.forEach(toy=>{
      toysRender(toy)
    })
  })



function toysRender(toy){
  let newToyDiv = document.createElement('div')
  newToyDiv.className = 'card'
  newToyDiv.dataset.id = `${toy.id}`
  newToyDiv.innerHTML = `<h2>${toy.name}</h2>
                         <img src=${toy.image} class="toy-avatar" />
                         <p>${toy.likes} likes</p>
                         <button class="like-btn">Like <3</button>
                         <button class="delete-btn">delete <3</button>`
  toyContainer.append(newToyDiv)
}

function send(name, image){
  fetch("http://localhost:3000/toys", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      image,
      "likes": 0 
    })
  })
    .then((response) => response.json())
    .then((toy) => {
      toysRender(toy)
  })
}
  

addToyForm.addEventListener('submit', e=>{
  e.preventDefault()
  send(toyNameSubmit.value, toyLinkSubmit.value)
})


function like(likesCount, id ){
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes" : likesCount
    })
  })
} 


function deleteToy(id) {
  return fetch(`http://localhost:3000/toys/${id}`, {
    method: 'delete'
  })
  .then(response => response.json());
}



document.addEventListener('click', e=>{
  let parentNode = e.target.parentNode
  let likes = e.target.previousElementSibling
  if(e.target.matches('.like-btn')){
    let likesCount = likes.innerHTML.split(' ')
    likesCount = parseInt(likesCount[0])
    likesCount++
    console.log(likesCount)
    like(likesCount,parentNode.dataset.id)
    likes.innerHTML = `${likesCount} likes`
  }
  else if(e.target.matches('.delete-btn')){
    let id = parentNode.dataset.id
    deleteToy(id)
    parentNode.remove()
  }
})