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
$('#todo-list').html(JSON.stringify(todos));
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

  $('#submit').click(function(){
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
	const todos = response.data.todos;
	console.log(todos);
	$('#todo-list').html(JSON.stringify(todos));
	},
	error: (error) => {
	console.log(error);
	}
  })
})
});