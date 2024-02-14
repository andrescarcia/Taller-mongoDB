use('sample_mflix');

// Encuentre las películas con una calificación en IMDb superior a 8, con menos de 1000 reviews en Tomatoes (viewer.numReviews), 
// en idioma francés o alemán, y de duración mayor a 70 mins.

db.movies.find({
    "imdb.rating": { $gt: 8 },
    "tomatoes.viewer.numReviews": { $lt: 1000 },
    "languages": { $in: ["French", "German"] },
    "runtime": { $gt: 70 }
  })
  

// Encuentra películas que hayan sido nominadas a más de tres premios, en coreano, japonés o mandarin , con menos de 50 reseñas en Tomatoes.

db.movies.find({
    "awards.nominations": { $gt: 3 },
    "languages": { $in: ["Korean", "Japanese", "Mandarin"] },
    "tomatoes.viewer.numReviews": { $lt: 50 }
  })
  



// Encuentre películas de género thriller y romance con una calificación de IMDb superior a 7,
//  pero con menos de 500 reviews, escrito por al menos 2 escritores y con una duración mayor a 80 minutos.


db.movies.find({
    "genres": { $all: ["Thriller", "Romance"] },
    "imdb.rating": { $gt: 7 },
    "imdb.votes": { $lt: 500 },
    "writers": { $exists: true, $size: 2 },
    "runtime": { $gt: 80 }
  })
  



// Con el pipeline de agregación:
// Identificar los 5 géneros principales de películas que tienen una duración media superior a 90 minutos y calificaciones en IMDb entre 5 y 8. 
// Deben ser ordenados por el número total de películas en cada género y, en caso de empate, por la duración promedio.


db.movies.aggregate([
    {
      $match: {
        "imdb.rating": { $gte: 5, $lte: 8 },
        "runtime": { $gt: 90 }
      }
    },
    {
      $unwind: "$genres"
    },
    {
      $group: {
        _id: "$genres",
        averageLength: { $avg: "$runtime" },
        totalFilms: { $sum: 1 }
      }
    },
    {
      $match: {
        averageLength: { $gt: 90 }
      }
    },
    {
      $sort: {
        totalFilms: -1,
        averageLength: -1
      }
    },
    {
      $limit: 5
    }
  ])



// Itifique los 3 países con la mayor cantidad de películas producidas, mostrando también la calificación promedio de IMDb para las películas de cada país.


db.movies.aggregate([
    {
      $unwind: "$countries"
    },
    {
      $group: {
        _id: "$countries",
        numberOfFilms: { $sum: 1 },
        averageIMDbRating: { $avg: "$imdb.rating" }
      }
    },
    {
      $sort: {
        numberOfFilms: -1
      }
    },
    {
      $limit: 3
    }
  ])
  


// Determine los 5 directores cuyas películas tienen la calificación promedio más alta en IMDb, considerando solo a aquellos directores con al menos 5 películas. Ordenar por calificación más alta.


db.movies.aggregate([
    {
      $unwind: "$directors"
    },
    {
      $group: {
        _id: "$directors",
        averageRating: { $avg: "$imdb.rating" },
        numberOfFilms: { $sum: 1 }
      }
    },
    {
      $match: {
        numberOfFilms: { $gte: 5 }
      }
    },
    {
      $sort: {
        averageRating: -1
      }
    },
    {
      $limit: 5
    }
  ])
  