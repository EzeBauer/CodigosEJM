// 1.Guardar al usuario en la DB
// 2.Buscar al usuario a loguear por su email
// 3.Buscar al usuario por su ID
// 4. Editar la información de un usuario
// 5.Eliminar a un usuario de la DB

const fs = require('fs');

const User = {
	fileName: './database/users.json', //hago referencia a mi base de datos

	getData: function () {
		return JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
		//me devuelve un array de objetos literales con todos los usuarios
	},

	generateId: function () {
		let allUsers = this.findAll();//toma a todos los usuarios
		let lastUser = allUsers.pop();//Toma al ultimo usuario
		if (lastUser) { //si tengo un ultimo usuario
			return lastUser.id + 1;//retorna el id del ultimo usuario + 1
		}
		return 1;//Si el archivo fuera un array vacio, le pongo 1 al id
	},

	findAll: function () {
    return this.getData();
    //me permite listar a todos los usuarios (igual que detData)
  },

	findByPk: function (id) { //BUSCAR UN USUARIO A TRAVES DEL ID
		let allUsers = this.findAll();//llamo a todos los usuario en un array
		let userFound = allUsers.find(oneUser => oneUser.id === id);
		//itera a todos los usuarios y me busca al usuario con id igual al id ingresado
		return userFound;// retorna al usuario encontrado
	},

	findByField: function (field, text) {//QUE SE BUSQUE A UN USUARIO POR CUALQUIER CAMPO DE BUSQUEDA
		let allUsers = this.findAll();
		let userFound = allUsers.find(oneUser => oneUser[field] === text);
		//al ser find, me devuelve solo a un usuario (ej: si busco por "country" me va a devolver solo al primero que cumpla
		//con el parametro, no a todos)
		return userFound;
		//console.log(User.findByField('email, "emailquebusco"))
	},

	create: function (userData) {//GUARDAR AL USUARIO EN LA BASE DE DATOS
		let allUsers = this.findAll();//Me traigo a todos los usuarios
		let newUser = {
			id: this.generateId(),//De este objeto literal(User)el metodo para generar un id
			...userData //toda la info que me llego del objeto literal userData
		}
		allUsers.push(newUser);//pusheo a mi nuevo usuario al array de todos los usuarios
		fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null,  ' '));
		//Vuelvo a reescribir el archivo JSON
		return newUser;
		//console.log(User.create([fullName: "Javi", email:"javi@gmail.com"]))
	},
	/* console.log(User.create(
		{
			name: 'Juan',
			email:'juancito@gmail.com'
		}
	))
 */
	delete: function (id) {//identifico al usuario a eliminar por el id
		let allUsers = this.findAll();
		let finalUsers = allUsers.filter(oneUser => oneUser.id !== id);
		//Me devuelve a todos los usuarios menos al que tiene el ID que le coloco
		fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, ' '));//reescribo el JSON
		return true;
	}
}

module.exports = User;