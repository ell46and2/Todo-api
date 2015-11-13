var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true&q=house
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};
	
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;	
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;		
	}
	
	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: `%${query.q}%`
		};
	}
	
	db.todo.findAll({where: where}).then(function(todos) {
			res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
	
// 	var filteredTodos = todos;
// 	
// 	// if has property && completed === 'true'
// 	// filteredTodos =  _.where(filteredTodos, {'completed': true})
// 	// else if has property && completed === 'false'
// 	// filteredTodos =  _.where(filteredTodos, {'completed': false})
// 	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
// 		filteredTodos = _.where(filteredTodos, {completed: true});
// 	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
// 		filteredTodos = _.where(filteredTodos, {completed: false});
// 	}
// 
// 	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
// 		// _.filter - Looks through each value in the list, returning an array of all the values that pass a truth test
// 		filteredTodos = _.filter(filteredTodos, function(todo) { return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;});
// 	}
// 	
// 	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	//var matchedTodo;
	
	// uses _.findWhere function from underscores. It returns the first matching value.
	// _.findWhere(list, properties to match)
	//var matchedTodo = _.findWhere(todos, {id: todoId});
	
	db.todo.findById(todoId).then(function(todo) {
		if(todo) {
			res.json(todo);
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
	
	
	
	// var matchedTodo;
	// // Iterate over todos array. Find the match.
	// for(var i =0; i<todos.length; i++) {	
	// 	if(todos[i].id === todoId) {
	// 		matchedTodo = todos[i];
	// 	}
	// }
	/*if(matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();	
	}*/
});

// POST /todos
app.post('/todos', function(req, res) {
	// uses _.pick function from underscores. Returns a copy of the object, filtered to only have the selected values.
	var body = _.pick(req.body, 'description', 'completed');
	
	db.todo.create(body).then(function(todo){
			res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
	// respond with 200 and todo.toJSON
	// else res.status(400).json.(e)
	
	
	// //if completed is not a boolean OR description isn't a string OR description is just spaces.
	// if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }
	// 
	// // set body.description to be trimmed value
	// body.description = body.description.trim();
	// 
	// // add id field
	// body.id = todoNextId;
	// todoNextId++;
	// // push body into array
	// todos.push(body);
	// 
	// 
	// res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if(rowsDeleted ===0) {
			res.status(404).json({
				error: 'No todo with that id'
			});
		} else {
			res.status(204).send();	
		}
	}, function() {
		res.status(500).send();
	});
	
	// // uses _.findWhere function from underscores. It returns the first matching value.
	// // _.findWhere(list, properties to match)
	// var matchedTodo = _.findWhere(todos, {id: todoId});
	// 
	// if(!matchedTodo) {
	// 	res.status(404).json({"error": "No todo found with that id"});
	// } else {
	// 	//Returns a copy of the array with all instances of the values removed.
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo);
	// }
	
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};
	var todoId = parseInt(req.params.id, 10);
	
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	} 
	
	if(body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}
	
		// Copy all of the properties in the source objects over to the destination object, and return the destination object.
		// Objects in JS are passed by reference, so changing matchedTodo also chages the original reference in the todos array.
		//  _.extend(matchedTodo, validAttributes);
		// 
		// res.json(matchedTodo);
		
		db.todo.findById(todoId).then(function(todo) {
			if(todo) {
				todo.update(attributes).then(function(todo) {
					res.json(todo.toJSON());
				}, function(e) {
				res.status(400).json(e);
				});
			} else {
				res.status(404).send();
			}
		}, function() {
			res.status(500).send();
		});
});

// POST /users
app.post('/users', function(req, res) {
	// uses _.pick function from underscores. Returns a copy of the object, filtered to only have the selected values.
	var body = _.pick(req.body, 'email', 'password');
	
	db.user.create(body).then(function(user){
			res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});
	
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log(`Express listening on port ${PORT}!`);
	});
})

