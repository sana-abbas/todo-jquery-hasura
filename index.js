// A $( document ).ready() block.
// read more about this at https://learn.jquery.com/using-jquery-core/document-ready/
const getTodos = () => {
const hasuraUrl = 'https://leadwithher.herokuapp.com/v1/graphql';
const postData = {
query: `
query getTodos {
todos {

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
    todosHTML += `<li id="list-todo" data-id="${todo.id}">${todo.title}</li>`;
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
	//const todos = response.data.todos;
	//console.log(todos);
  getTodos();
},
	error: (error) => {
	console.log(error);
	}
  })
})

  $('#list-todo').click(function(){
    //e.preventDefault();
    let updateData = {
  query: `
  mutation update_todos($newTodo:String!) {
    update_todos(
    objects: [
      {
        id: $updateTodo,
        completed: true
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
    updateTodo : $('#this').data('id')
  }
}
  $.ajax({
    type: "POST",
    url: 'https://leadwithher.herokuapp.com/v1/graphql',
    data: JSON.stringify(newData),
    contentType: 'application/json',
    dataType: 'json',
  success: (response) => {
  //const todos = response.data.todos;
  //console.log(todos);
  console.log(response);
},
  error: (error) => {
  console.log(error);
  }
  })
})
});