/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/


// // Select the database to use.
use('sample_restaurants');


// Consultas para el conjunto de datos sample_restaurants.restaurants


// 1. Buscar restaurantes que NO sean de cocina china y que hayan recibido alguna calificación inferior a 'C'.
db.restaurants.find({
  "cuisine": { $ne: "Chinese" },
  "grades.grade": { $in: ["D", "E", "P"] }
})




  // 2. Buscar todos los restaurantes de cocina japonesa en Manhattan que hayan recibido al menos una calificación de 'C' con una puntuación entre 20 y 30.
  db.restaurants.find({
    "cuisine": "Japanese",
    "borough": "Manhattan",
    "grades": {
      $elemMatch: {
        "grade": { $eq: "C" }, // al menos un grado 'C'
        "score": { $gte: 20, $lte: 30 } // Score entre 20 y 30
      }
    }
  })
 
 
  // 3. Encuentre todos los restaurantes en Queens, con código postal 11377, cuyo nombre contenga 'Pizza', y que no hayan
  // recibido una calificación de 'A' con una puntuación inferior a 10.
  db.restaurants.find({
    "borough": "Queens",
    "address.zipcode": "11377",
    "name": /Pizza/i, // "Pizza" en el nombre (con P mayuscula)
    "grades": {
      $not: {
        $elemMatch: {
          "grade": "A",
          "score": { $lt: 10 } // Score menos de 10
        }
      }
    }
  })
  // 4. Encuentre todos los restaurantes (excepto de comida rápida ‘Fast Food’) ubicados en las calles (address.street ) que contienen 'Avenue' y
  // en códigos postales (address.zipcode) desde 10000 hasta 10019, que hayan recibido calificaciones (grade) 'B' o 'C' con una puntuación (score) entre 20 y 35.
  db.restaurants.find({
    "cuisine": { $ne: "Fast Food" }, // Excluye 'Fast Food cuisine'
    "address.street": /Avenue/i, //Calles que contengan 'Avenue', (case-insensitive)
    "address.zipcode": { $gte: "10000", $lte: "10019" }, // Zip codes desde 10000 a 10019
    "grades": {
      $elemMatch: {
        "grade": { $in: ["B", "C"] }, //grados 'B' o 'C'
        "score": { $gte: 20, $lte: 35 } // Score entre 20 y 35
      }
    }
  })




//   Con el pipeline de agregación:
// 1. Identifique el top cinco de códigos postales con la mayor cantidad de restaurantes italianos.
db.restaurants.aggregate([
  { $match: { "cuisine": "Italian" } }, //  1: Filtrar los restaurantes italianos
  { $group: {
      _id: "$address.zipcode", //  2: Agrupar por Zip
      count: { $sum: 1 } // Contar el numero de restaurantes en cada grupo
    }
  },
  { $sort: { "count": -1 } }, //  3: Ordenar los grupos en orden descendente
  { $limit: 5 } //  4: limitar a los primeros 5
])


// 2. Encuentre de mayor a menor la cantidad de restaurantes por barrio (borough) que tienen al menos una calificación de 'B'(grade) o superior.




db.restaurants.aggregate([
  {
    $match: {
      "grades.grade": { $in: ["A", "B"] } //  1: filtrar por restauranes con un grade mayor a B
    }
  },
  {
    $group: {
      _id: "$borough", //  2: Agrupar por 'borough'
      numberOfRestaurants: { $sum: 1 } // Contar el numero en cada grupo
    }
  },
  {
    $sort: {
      numberOfRestaurants: -1 //  3: Ordenar de forma descendente
    }
  }
])



// 3. Determine el número total de restaurantes en el barrio 'Kings'.


db.restaurants.aggregate([
  { $match: { "address.neighborhood": "Kings" } }, //  1: Filtrar por barrio 'Kings'
  { $count: "totalRestaurants" } //  2: Contar el numero de restaurantes
])
