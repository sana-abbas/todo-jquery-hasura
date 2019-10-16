// A $( document ).ready() block.
// read more about this at https://learn.jquery.com/using-jquery-core/document-ready/
const getTodos = () => {
const hasuraUrl = 'https://leadwithher.herokuapp.com/v1/graphql';
const postData = {
query: `
query getTodos {
todos {
id
title
completed
}
}
`
};
var user_name = $('#user_name').val();
$.ajax({
type: 'POST',
url: hasuraUrl,
headers: {'x-hasura-user-name': user_name},
data: JSON.stringify(postData),
contentType: 'application/json',
dataType: 'json',
success: (response) => {
	const todos = response.data.todos;
	console.log(todos);
  let todosHTML = ""
  for (todo of todos) {
    todosHTML += `<li class="list-group-item list-group-item-primary" onclick="myFunction(this)" data-id="${todo.id}"> ${todo.title} </li>
    <br>
    <p><input type="button" onclick="deleteFunction(this)" class="btn btn-danger btn-small" data-id="${todo.id}" value="Delete"></p>`;
  }
  var user_name = $('#user_name').val();
  
$('#title').html("<p class='alert alert-success custom'>" + user_name + ", you have these items in your list!</p><br><br>");
$('#todo-list').html(`<div class="alert alert-secondary"><ul class="list-group">
  ${todosHTML}
  </ul></div>`);
$('li').toggleClass('strike');
},
error: (error) => {
console.log(error);
}
})
}


$( document ).ready(function() {
  console.log( "jQuery and the document is ready!" );

  $('.user').click(function(e){
   e.preventDefault(); 
  getTodos();

  })

  $('.submit').click(function(e){
    e.preventDefault();
    let newData = {
	query: `
	mutation insert_todos($newTodo:String!) {
  	insert_todos(
    objects: [
      {
        title: $newTodo,
        completed: false
      }
    ]
  	) {
    returning {
      id
      title
      completed
    	}
  	}
	}
	`,
	variables: {
		newTodo : $('#newTodo').val(),
	}
}
var user_name = $('#user_name').val();
  $.ajax({
  	type: "POST",
  	url: 'https://leadwithher.herokuapp.com/v1/graphql',
  	data: JSON.stringify(newData),
    headers: {'x-hasura-user-name': user_name},
  	contentType: 'application/json',
    dataType: 'json',
	success: (response) => {
    $('#newTodo').val("");
  getTodos();
},
	error: (error) => {
	console.log(error);
	}
  })
})

  myFunction = function(element){
   var list = $(element).attr('data-id');
   
  let updateData = {
  query: `
  mutation update_todos($id: uuid) {
  update_todos(
    where: {
    id: {_eq:$id }
    },
    _set: {
      completed: true,
    }
  ) {
    affected_rows
    returning {
      completed
      title
    }
  }
} `,
  variables: {
    id : list
  } 
}
var user_name = $('#user_name').val();
  $.ajax({
    type: "POST",
    url: 'https://leadwithher.herokuapp.com/v1/graphql',
    headers: {'x-hasura-user-name': user_name},
    data: JSON.stringify(updateData),
    contentType: 'application/json',
    dataType: 'json',
  success: (response) => {
    console.log(response);
    $(element).toggleClass('strike');
},
  error: (error) => {
  console.log(error);
  }
  })
  //getTodos();
}

updateFunction = function(element){
    var list = $(element).attr('data-id');
  let update = { 
query:
`mutation update_todos($id: uuid) {
  update_todos(
    where: {
        id: {_eq:$id },
        
      },
    _set: {
      completed: false
    }
  ) {
    affected_rows
    returning {
      completed
      title
    }
  }
}
  `,
  variables: {
    id : list
  }
}
var user_name = $('#user_name').val();
$.ajax({
    type: "POST",
    url: 'https://leadwithher.herokuapp.com/v1/graphql',
    headers: {'x-hasura-user-name': user_name},
    data: JSON.stringify(update),
    contentType: 'application/json',
    dataType: 'json',
  success: (response) => {
  console.log(response);
  $(element).removeClass('strike');
  
},
  error: (error) => {
  console.log(error);
  }
  })
}

deleteFunction = function(element){
   var list = $(element).attr('data-id');
   
  let deleteData = {
  query: `
  mutation delete_todos($id: uuid) {
  delete_todos(
    where: {id: {_eq:$id }},
  ) {
    affected_rows
  }
}
  `,
  variables: {
    id : list
  }
}
var user_name = $('#user_name').val();
$.ajax({
    type: "POST",
    url: 'https://leadwithher.herokuapp.com/v1/graphql',
    headers: {'x-hasura-user-name': user_name},
    data: JSON.stringify(deleteData),
    contentType: 'application/json',
    dataType: 'json',
  success: (response) => {
  getTodos();
  
},
  error: (error) => {
  console.log(error);
  }
  })
}

});