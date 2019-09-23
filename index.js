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

$.ajax({
type: 'POST',
url: hasuraUrl,
data: JSON.stringify(postData),
contentType: 'application/json',
dataType: 'json',
success: (response) => {
	const todos = response.data.todos;
	console.log(todos);
  let todosHTML = ""
  for (todo of todos) {
    todosHTML += `<li id="list-todo" onclick="myFunction(this)" data-id="${todo.id}"> ${todo.title} </li><span onclick="deleteFunction(this)" data-id="${todo.id}"><i class="fas fa-trash-alt"></i></span>`;
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

  getTodos();

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
    where: {id: {_eq:$id }},
    _set: {
      completed: true
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
    data: JSON.stringify(updateData),
    contentType: 'application/json',
    dataType: 'json',
  success: (response) => {
  $(element).toggleClass('strike');
},
  error: (error) => {
  console.log(error);
  }
  })
  //getTodos();
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