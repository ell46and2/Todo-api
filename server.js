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

// GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
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

app.listen(PORT, function() {
	console.log(`Express listening on port ${PORT}!`);
});