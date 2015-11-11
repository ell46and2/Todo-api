var person = {
	name: 'Elliot',
	age: 21
};

function updatePerson(obj) {
	// obj = {
	// 	name: 'Elliot',
	// 	age: 32
	// };
	obj.age = 32;
}

updatePerson(person);
console.log(person);

// Array Example
var grades = [10, 15];

function addGrade(obj) {
	obj.push(20);
	//debugger;
}

addGrade(grades);

console.log(`grades: ${grades}`);