Javascript initial render

- Read Dogs

```Javascript
fetch("http://localhost:3000/users")
  .then(response => response.json())
  .then(userArr => {
    usersArray.forEach(function(user){
      renderUser(user)
    })
  })
```
- Now, we need to get our front end data in sync with the backend data
- Use .dataset to get access to all data-x attributes
- Restful route for deleting user 
  - verb: DELETE
  - path: /users/:id

```Javascript
// in the event listener on the form
// delete user
  if (e.target.dataset.action === "delete"){
    const userId = e.target.dataset.id
    fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE"
    })
    .then(response => {
      // we're waiting for this response to come back before updating the DOM
      // known as pessimistic rendering
      // can be a good idea to show a loading animation if using pessimistic rendering
      if(response.ok){
        const cardLi = e.target.closest(".card")
        cardLi.remove()
      }
    })
  }

  ////////////////////////////////////////////
    // here, we remove the card regardless of the response
    // known as optimistic rendering
    // like how you can still like an image on instagram and the heart still appears
    // the heart-ing animation is optimistic
  const cardLi = e.target.closest(".card")
  cardLi.remove()
``` 

- Create user

```Javascript
newUserForm.addEventListener("submit", function(e){
  e.preventDefault() //always use for a submit event
  const newUser = {
    name: e.target.name.value,
    profilePic: e.target.profilePic.value
    //etc
  }
  // restful routing for create
  //  verb: POST
  // route: /users/
  // not /users/new since we have the form already
  fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
    body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(actualNewUser => {
      renderUser(actualNewUser)
    })
  })
})
```

- When X event happens
- do Y fetch request
- slap Z on/off the DOM

```Javascript

```