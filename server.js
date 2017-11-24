var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/movie-api');

var Movie = require('./model/movie');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/movie', function (request, response) {
    var movie = new Movie();
    movie.title = request.body.title;
    movie.category = request.body.category;
    movie.years = request.body.years;
    movie.save(function (error, savedMovie) {
        if (error) {
            response.status(500).send({error: "Could not save movie"});
        } else {
            // response.status(200).send(savedMovie);
            response.send(savedMovie);
        }
    })
});

app.get('/movie', function (request, response) {
    Movie.find({}, function (error, movies) {
        if (error) {
            response.status(500).send({error: "Could not fetch movies"});
        } else {
            response.send(movies);
        }
    });
});

app.pu('wishlist/movie/add', function (request, response) {
    Movie.findOne({_id: request.body.movieId}, function(error, movie) {
        if (error) {
            response.status(500).send({error: "Could not add item to wishlist"});
        } else {
            WishList.update({_id: request.body.wishListId}, {$addToSet:{movies: movie._id}}, function (error, wishList) {
                if (error) {
                    response.status(500).send({error: "Could not add item to wishlist"});
                } else {
                    response.send(wishList);
                }
            });
        }
    });
});
app.get('/wishlist', function (request, response) {
   WishList.finc({}).populate({path:'movies', model: 'Movie'}).exec(function (error, wishLists) {
       if (error) {
           response.status(500).send({error: "Could not fetch wishlists"});
       } else {
           response.status(200).send(wishLists);
       }
   });
});

app.post('/wishlist', function (request, response) {
    var wishList = new WishList;
    wishList.title =  request.body.title;

    wishList.save(function (error, newWishList) {
        if (error) {
            response.status(500).send({error: "Could not create wishlist"})
        } else {
            response.send(newWishList);
        }
    });
});

// var ingredients = [
//     {
//         "id": "12345",
//         "text": "CAT"
//     },
//     {
//         "id": "2222",
//         "text": "DOG"
//     },
//     {
//         "id": "3333",
//         "text": "BIRD"
//     }
// ];
//
// app.get('/', function (request, response) {
//     // res.send('Movie API!');
//     response.send(ingredients);
// });
//
// app.post('/', function (request, response) {
//     var ingredient = request.body;
//     if (!ingredient || ingredient.text ===  "") {
//         response.status(500).send({error: "Your ingredient must have a text"});
//     } else {
//         ingredients.push(ingredient);
//         response.status(200).send(ingredients);
//     }
// });
//
// app.put('/ingredients/:ingredientId', function (request, response) {
//     // var ingredientId = request.param.ingredientId;
//
//     var newText = request.body.text;
//
//     if (!newText || newText === "") {
//         response.status(500).send({error: "You must provide ingredient text"})
//     } else {
//         var objectFound = false;
//
//         for (var x = 0; x < ingredients.length; x++) {
//             var ing = ingredients[x];
//
//             if (ing.id === request.param.ingredientId) {
//                 ingredients[x].text = newText;
//                 objectFound = true;
//                 break;
//             }
//         }
//         if (!objectFound) {
//             response.status(500).send({error: "Ingredient id not found"});
//         } else {
//             response.send(ingredients);
//         }
//     }
//
// });

app.listen(3009, function () {
    console.log("Movie API running on port 3009!");
});