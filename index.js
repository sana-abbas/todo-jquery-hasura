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
headers: {'X-Hasura-User-Name': 'user_name'},
data: JSON.stringify(postData),
contentType: 'application/json',
dataType: 'json',
success: (response) => {
	const todos = response.data.todos;
	console.log(todos);
  let todosHTML = ""
  for (todo of todos) {
    todosHTML += `<li id="list-todo" onclick="myFunction(this)" data-id="${todo.id}"> ${todo.title} </li><input type="button" onclick="deleteFunction(this)" data-id="${todo.id}" value="Delete">`;
  }
$('#todo-list').html(`<ul>
  ${todosHTML}
  </ul>`);
},
error: (error) => {
console.log(error);
}
})
}


$( document ).ready(function() {
  console.log( "jQuery and the document is ready!" );
  $('#title').html('This was from JavaScript')

  $('#user').click(function(e){
   e.preventDefault(); 
  getTodos();
  })

  $('#submit').click(function(e){
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
		newTodo : $('#newTodo').val()
	}
}
  $.ajax({
  	type: "POST",
  	url: 'https://leadwithher.herokuapp.com/v1/graphql',
  	data: JSON.stringify(newData),
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
    completed: {_eq:false}
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

  $.ajax({
    type: "POST",
    url: 'https://leadwithher.herokuapp.com/v1/graphql',
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
$.ajax({
    type: "POST",
    url: 'https://leadwithher.herokuapp.com/v1/graphql',
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
$.ajax({
    type: "POST",
    url: 'https://leadwithher.herokuapp.com/v1/graphql',
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