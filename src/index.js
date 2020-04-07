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

	// grab the target element to append to
	const toyCollection = document.querySelector('#toy-collection');

	// load any current toys from the database
	fetch('http://localhost:3000/toys')
		.then(response => response.json())
		.then(toys => {
			toys.forEach(toy => {
				generateCard(toy.id, toy.name, toy.image, toy.likes)
			});
		});

	// handle form submissions
	document.querySelector('.add-toy-form').addEventListener('submit', event => {
		event.preventDefault();
		const formElements = event.target.elements;
		addNewToy(formElements.name.value, formElements.image.value);
		event.target.reset();
	})

	toyCollection.addEventListener('click', event => {
		if(event.target.className == 'like-btn'){
			// prevent any default button action
			event.preventDefault();
			// grab the toy card
			const toyCard = event.target.closest('.card');
			// get the current like count
			let likeCount = null;
			fetch('http://localhost:3000/toys/' + toyCard.dataset.id)
				.then(response => response.json())
				.then(toy => {
					likeCount = toy.likes

					// increment the like count
					likeCount = parseInt(likeCount) + 1;

					// save the new count to the database
					fetch('http://localhost:3000/toys/' + toyCard.dataset.id, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
						},
						body: JSON.stringify({likes: likeCount})
					})
						.then(response => response.json())
						.then(newToy => {
							if (newToy) {
								// show the count on the page

								// grab the target
								const textTarget = toyCard.querySelector('p');

								// update the text
								textTarget.textContent = newToy.likes + ' ' + likeVsLikes(newToy.likes);						
							}
						});
				});
		} else if (event.target.className === 'toy-avatar') {
			event.preventDefault();

			// grab the toy card
			const toyCard = event.target.closest('.card');
			
			// delete the toy from the database
			fetch('http://localhost:3000/toys/' + toyCard.dataset.id, {
				method: 'DELETE'
			})
				.then(response => {
					if (response.ok){
						// delete the card from the DOM
						toyCard.remove();
						console.log('deleted? ', response.ok);
					} else {
						console.log('something went wrong!');
						console.log('fetch response: ', response);
					}
				})	
		}
	});

	// functions -----------------------------------------

	// function for generating toy cards
	function generateCard(toyId, toyName, toyImageUrl, toyLikeCount){
		// generate the header
		const h2 = document.createElement('h2');
		h2.append(toyName);

		// generate the image
		const img = document.createElement('img');
		img.src = toyImageUrl;
		img.classList.add('toy-avatar');

		// generate the like count
		const p = document.createElement('p');
		p.append(toyLikeCount + ' ' + likeVsLikes(toyLikeCount));

		// generate the like button
		const button = document.createElement('button');
		button.classList.add('like-btn');
		button.append('Like 🖤');

		// generate the final toy card
		const toyCard = document.createElement('div');
		toyCard.dataset.id = toyId;
		toyCard.classList.add('card');
		toyCard.append(h2, img, p, button);

		// append it to the page
		toyCollection.append(toyCard);
	}

	// function to handle pluralization of likes
	function likeVsLikes(toyLikeCount){
		if (toyLikeCount == 1){
			return 'Like';
		} else {
			return 'Likes';
		}
	}

	// function to add a new toy
	function addNewToy(name, image){
		fetch('http://localhost:3000/toys', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
  				'Accept': 'application/json'
			},
			body: JSON.stringify({name, image, likes: 0})
		})
			.then(response => response.json())
			.then(newToy => {
				if (newToy) {
					generateCard(newToy.id, newToy.name, newToy.image, newToy.likes);
				}
			});
	}


});
