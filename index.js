class UserTracker {

	constructor(){
		this.postsUrl = "https://jsonplaceholder.typicode.com/posts";
		this.todoUrl = "https://jsonplaceholder.typicode.com/todos";
	}

	//Records a post for a user
	insertPost(user_id, post) {
		fetch("https://jsonplaceholder.typicode.com/posts", {
			method: "POST",
			body: JSON.stringify({
				title: post.hello,
				body: post.body,
				userId: user_id
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(response => response.json())
		.then(json => {
			//show success message
			document.querySelector(`.section${user_id} .postSuccess`).style.display = "block";
		})
		.catch(function(error) {
		    console.log(error);
		}); 
	}

	//Records a todo for a user
	insertTodo(user_id, todoText) {
		fetch("https://jsonplaceholder.typicode.com/todos", {
			method: "POST",
			body: JSON.stringify({
				title: todoText,
				completed: false,
				userId: user_id
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(response => response.json())
		.then(json => {
			console.log(json);
			//show success message
			document.querySelector(`.section${user_id} .todoSuccess`).style.display = "block";
		})
		.catch(function(error) {
		    console.log(error);
		}); 
	}

	//Show the post where the body text has smallest length for the user
	showSmallestPostByBody(user_id) {
		this.getAllPosts(user_id).then((data) =>{
			let smallestBodyObj = data.reduce(function(prev, curr) {
				return prev.body.length < curr.body.length ? prev : curr;
			});
			//use helper function to append post to section
			this.appendNode(`.section${user_id} .smallestPost`, smallestBodyObj.title, null);
		});	
	}

	//Show the post where the body text has longest length for the user
	showLongestPostByBody(user_id) {
		this.getAllPosts(user_id).then((data) =>{
			let longestBodyObj = data.reduce(function(prev, curr) {
				return prev.body.length > curr.body.length ? prev : curr;
			});
			//use helper function to append post to section
			this.appendNode(`.section${user_id} .longestPost`, longestBodyObj.body, null);
		});	
	}

	//Show the post where the title text has smallest length for the user
	showSmallestPostByTitle(user_id) {
		this.getAllPosts(user_id).then((data) =>{
			let smallestTitleObj = data.reduce(function(prev, curr) {
				return prev.title.length < curr.title.length ? prev : curr;
			});
			//use helper function to append post to section
			this.appendNode(`.section${user_id} .smallestTitle`, smallestTitleObj.title, null);
		});	
	}

	//Show the post where the title text has longest length for the user
	showLongestPostByTitle(user_id) {
		this.getAllPosts(user_id).then((data) =>{
			let longestTitleObj = data.reduce(function(prev, curr) {
				return prev.title.length > curr.title.length ? prev : curr;
			});
			//use helper function to append post to section
			this.appendNode(`.section${user_id} .longestTitle`, longestTitleObj.title, null);	
		});	
	}

	//Show the todo where the title text has smallest length for the user
	showSmallestTodo(user_id) {
		this.getAllTodos(user_id).then((data) =>{
			let smallestTodoObj = data.reduce(function(prev, curr) {
				return prev.title.length < curr.title.length ? prev : curr;
			});
			//use helper function to append post to section
			this.appendNode(`.section${user_id} .smallestTodo`, smallestTodoObj.title, null);
		});	
	}

	//Show the todo where the title text has longest length for the user
	showLongestTodo(user_id) {
		this.getAllTodos(user_id).then((data) =>{
			let longestTodoObj = data.reduce(function(prev, curr) {
				return prev.title.length > curr.title.length ? prev : curr;
			});
			//use helper function to append post to section
			this.appendNode(`.section${user_id} .longestTodo`, longestTodoObj.title, null);
		});	
	}

	showAllPosts(user_id){
    	let posts = "<div class='flex'>";
		userTracker.getAllPosts(user_id).then((data) =>{
			data.map(function(item){
				posts+= `<div class="tiles"><h3>${item.title}</h3><div>${item.body}</div></div>`;
			})
			posts+= '</div>';
			document.querySelector(`.section${user_id} .allPostsWrapper`).innerHTML = posts;
		});	
	}

	showAllTodos(user_id){
		let todos = "";
		userTracker.getAllTodos(user_id).then((data) =>{
			data.map(function(item){
				todos+= `<li class="capitalize">${item.title}</li>`;			
			})
			document.querySelector(`.section${user_id} .allTodosWrapper`).innerHTML = todos;	
		});	
	}

	//helper functions

	//used to append post text to relevant div and set class name to the div
	appendNode(nodeAppendTo, data, className){
		let div = document.createElement("div");
		let dataDiv = document.querySelector(nodeAppendTo).appendChild(div);
		dataDiv.innerHTML = data;

		if (className){
			div.classList.add(className);
		}
	}

	//fetch all posts for user
	getAllPosts(user_id){
		return fetch(`${this.postsUrl}?userId=${user_id}`)
		.then(response => response.json())
		.then(json => {
			return json
		})
		.catch(function(error) {
		    console.log(error)
		}); 
	}

	//fetch all todos for user
	getAllTodos(user_id){
		return fetch(`${this.todoUrl}?userId=${user_id}`)
		.then(response => response.json())
		.then(json => {return json})
		.catch(function(error) {
		    console.log(error)
		}); 
	}

	//append new section for each user
    appendSection(user_id){
    	let section = document.querySelector('section');
    	let sectionClone = section.cloneNode(true);
    	sectionClone.classList.add("section"+ user_id);
    	document.querySelector('.wrapper').appendChild(sectionClone);
    	document.querySelector(`.section${user_id} h2`).innerHTML = `User ${user_id}`;

    	//for accordion to work properly, it needs unique ids for collapsable components
    	//select all collapsable divs inside this section and add ids
    	let collapseDivs = document.querySelectorAll(`.section${user_id} .collapse`);
    	for (let i=0; i < collapseDivs.length; i++){
    		collapseDivs[i].id = `user${user_id}collapse${i+1}`;
    	}

    	//select all buttons to collapse and set their attr data-target to id of the div which to open
    	let collapseButtons = document.querySelectorAll(`.section${user_id} .btn-link`);
    	for (let i=0; i < collapseButtons.length; i++){
    		collapseButtons[i].setAttribute("data-target", `#user${user_id}collapse${i+1}`);
    	}

    	//add event listeners for buttons inside each section
    	//add Post: get input data and call insertPost
    	let submitPostButton = document.querySelector(`.section${user_id} .submitPostButton`);
    	submitPostButton.addEventListener("click", function(){
    		let title = document.querySelector(`.section${user_id} .postTitle`).value;
    		let body = document.querySelector(`.section${user_id} .postBody`).value;
    		userTracker.insertPost(user_id, {title:title, body:body});
    	});

    	//add Todo: get input text and call insertTodo
    	let submitTodoButton = document.querySelector(`.section${user_id} .submitTodoButton`);
    	submitTodoButton.addEventListener("click", function(){
    		let todoText = document.querySelector(`.section${user_id} .todoText`).value;
    		userTracker.insertTodo(user_id, todoText);
    	});

    }

}

//instantiate objects for odd numbered users
for (let i=0; i <= 5; i++){
	if (i % 2  !== 0){
		var userTracker = new UserTracker();
		userTracker.appendSection(i);
		userTracker.showSmallestPostByBody(i);
		userTracker.showLongestPostByBody(i);
		userTracker.showSmallestPostByTitle(i);
		userTracker.showLongestPostByTitle(i);
		userTracker.showSmallestTodo(i);
		userTracker.showLongestTodo(i);
		userTracker.showAllPosts(i);
		userTracker.showAllTodos(i);
	}
}






