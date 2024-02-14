
use('sample_airbnb');
// Consulta 1: Buscar inmuebles con al menos 3 dormitorios y 2 baños.

db.listingsAndReviews.find({
        "bedrooms": {"$gte": 3},
        "bathrooms": {"$gte": 2.0}
    })
    
// Consulta 2: Encuentre anuncios que admitan mascotas y que tengan Wi-Fi entre los servicios.

db.listingsAndReviews.find({
  "amenities": {"$all": ["Pets allowed", "Wifi"]}
})


// Pipeline de agregación
// Agregación 1: Encuentre el número medio de dormitorios y cuartos de baño para los listados en Portugal, agrupados por tipo de propiedad.

db.listingsAndReviews.aggregate([
    {
      "$match": {
        "address.country": "Portugal"
      }
    },
    {
      "$group": {
        "_id": "$property_type",
        "averageBedrooms": {"$avg": "$bedrooms"},
        "averageBathrooms": {"$avg": {"$toDouble": "$bathrooms"}}
      }
    },
    {
      "$sort": {"averageBedrooms": -1, "averageBathrooms": -1}
    }
  ])

// Agregación 2: Enumere los 5 servicios más comunes en todos los anuncios.

db.listingsAndReviews.aggregate(
    [
        {
          "$unwind": "$amenities"
        },
        {
          "$group": {
            "_id": "$amenities",
            "count": {"$sum": 1}
          }
        },
        {
          "$sort": {"count": -1}
        },
        {
          "$limit": 5
        }
      ])