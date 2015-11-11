var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	
	// if has property && completed === 'true'
	// filteredTodos =  _.where(filteredTodos, {'completed': true})
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	
	// else if has property && completed === 'false'
	// filteredTodos =  _.where(filteredTodos, {'completed': false})
	
	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	// uses _.findWhere function from underscores. It returns the first matching value.
	// _.findWhere(list, properties to match)
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	// var matchedTodo;
	// // Iterate over todos array. Find the match.
	// for(var i =0; i<todos.length; i++) {	
	// 	if(todos[i].id === todoId) {
	// 		matchedTodo = todos[i];
	// 	}
	// }
	if(matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();	
	}
});

// POST /todos
app.post('/todos', function(req, res) {
	// uses _.pick function from underscores. Returns a copy of the object, filtered to only have the selected values.
	var body = _.pick(req.body, 'description', 'completed');
	// if completed is not a boolean OR description isn't a string OR description is just spaces.
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	
	// set body.description to be trimmed value
	body.description = body.description.trim();
	
	// add id field
	body.id = todoNextId;
	todoNextId++;
	// push body into array
	todos.push(body);
	
	
	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	// uses _.findWhere function from underscores. It returns the first matching value.
	// _.findWhere(list, properties to match)
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	if(!matchedTodo) {
		res.status(404).json({"error": "No todo found with that id"});
	} else {
		//Returns a copy of the array with all instances of the values removed.
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
	
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	if(!matchedTodo) {
		return res.status(404).send();
	};
	
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	};
	
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	};
	
		// Copy all of the properties in the source objects over to the destination object, and return the destination object.
		// Objects in JS are passed by reference, so changing matchedTodo also chages the original reference in the todos array.
		 _.extend(matchedTodo, validAttributes);
		
		res.json(matchedTodo);
	
});
	

app.listen(PORT, function() {
	console.log(`Express listening on port ${PORT}!`);
});