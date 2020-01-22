// 'use strict';

// require('dotenv').config();
// const express = require('express');
// const app = express();

// const PORT = process.env.PORT || 3000;


// app.get('/data', (request, response) => {
//   let airplanes = {
//     departure: Date.now(),
//     canFly: true,
//     pilot: 'Well Trained'
//   }
//   response.status(200).json(airplanes);
// });

// app.use('*', (request, response) => response.send('Sorry, that route does not exist.'))





'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
// const pg = require('pg');

// Application Setup
const PORT = process.env.PORT || 3000;
const app = express();
// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', (error) => console.error('Connection Failure', error));

app.use(cors());

// Route Definitions

app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});

app.get('/location', locationHandler);
// app.get('/weather', weatherHandler);
// app.get('/events', eventsHandler);
// app.get('/yelp', yelpHandler);
// app.get('/trails', trailsHandler);
// app.get('/movies', moviesHandler);

app.use('*', notFoundHandler);
app.use(errorHandler);

// -------------------------------------------
// LOCATIONS
// -------------------------------------------

function locationHandler(request, response) {
  let city = request.query.city;
  let key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;        
    return superagent.get(url)
      .then(data => {
        const location = new Location(city, data);
        console.log('!!!!!!!!', data); 
        return response.status(200).json(location);
      })
      .catch((error) => errorHandler(error, request, response));
}

function Location(city, data) {
  this.search_query = city
  this.formatted_query = data.body[0].display_name;
  this.latitude = data.body[0].lat;
  this.longitude = data.body[0].lon;
}

// // -------------------------------------------
// // WEATHER
// // -------------------------------------------
// function weatherHandler(request, response) {
//   let latitude = request.query.latitude;
//   let longitude = request.query.longitude;
//   // Alternatively: let {latitude, longitude} = request.query;

//   getWeather(latitude, longitude)
//     .then(summaries => sendJson(summaries, response))
//     .catch((error) => errorHandler(error, request, response));
// }

// function getWeather(latitude, longitude) {
//   const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;
//   return superagent.get(url)
//     .then(data => parseWeatherData(data.body));
// }

// function parseWeatherData(data) {
//   try {
//     const weatherSummaries = data.daily.data.map(day => {
//       return new Weather(day);
//     });
//     return Promise.resolve(weatherSummaries);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }

// function Weather(day) {
//   this.forecast = day.summary;
//   this.time = new Date(day.time * 1000).toString().slice(0, 15);
// }

// // -------------------------------------------
// // Events
// // -------------------------------------------

// function eventsHandler(request, response) {
//   const location = request.query.formatted_query;
//   getEvents(location)
//     .then(eventsList => sendJson(eventsList, response))
//     .catch((error) => errorHandler(error, request, response));
// }

// function getEvents(location) {
//   // Note that this API doesn't return the right header, so Express cannot parse it into data.body
//   // For this reason, we need to manually do a JSON.parse() on data.text
//   const url = `http://api.eventful.com/json/events/search?location=${location}&date=Future&app_key=${process.env.EVENTFUL_API_KEY}`;
//   return superagent.get(url)
//     .then(data => parseEventsData(JSON.parse(data.text)))
//     .catch(err => console.error(err));
// }

// function parseEventsData(data) {
//   try {
//     const events = data.events.event.map(eventData => {
//       const event = new Event(eventData);
//       return event;
//     });
//     return Promise.resolve(events);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }

// function Event(event) {
//   this.link = event.url;
//   this.name = event.title;
//   this.event_date = event.start_time;
//   this.summary = event.description;
// }


// -------------------------------------------
// EXPRESS RENDERERS
// -------------------------------------------

function sendJson(data, response) {
  response.status(200).json(data);
}

function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

app.listen(PORT,() => console.log(`Listening on port ${PORT}`));


// // -------------------------------------------
// // YELP
// // -------------------------------------------


// function yelpHandler(request, response) {
//   const location = request.query.search_query;
//   getYelp(location)
//     .then(reviews => sendJson(reviews, response))
//     .catch((error) => errorHandler(error, request, response));
// }


// function getYelp(location) {
//   const url = `https://api.yelp.com/v3/businesses/search?location=${location}`;
//   return superagent.get(url)
//     .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
//     .then(data => parseYelpData(data.body));
// }

// // Helpers
// function parseYelpData(data) {
//   try {
//     const yelpSummaries = data.businesses.map(business => {
//       return new Yelp(business);
//     });
//     return Promise.resolve(yelpSummaries);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }

// function Yelp(business) {
//   this.tableName = 'yelps';
//   this.name = business.name;
//   this.image_url = business.image_url;
//   this.price = business.price;
//   this.rating = business.rating;
//   this.url = business.url;
//   this.created_at = Date.now();
// }

// // -------------------------------------------
// // TRAILS
// // -------------------------------------------

// function trailsHandler(request, response) {
//   let latitude = request.query.latitude;
//   let longitude = request.query.longitude;
//   // Alternatively: let {latitude, longitude} = request.query;
//   getTrails(latitude, longitude)
//     .then(trailsList => sendJson(trailsList, response))
//     .catch((error) => errorHandler(error, request, response));
// }

// function getTrails(latitude, longitude) {
//   const url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=200&key=${process.env.TRAIL_API_KEY}`;
//   return superagent.get(url)
//     .then(data => parseTrailsData(data.body));
// }

// function parseTrailsData(data) {
//   try {
//     const trails = data.trails.map(trail => {
//       return new Trail(trail);
//     });
//     return Promise.resolve(trails);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }

// function Trail(trail) {
//   this.tableName = 'trails';
//   this.name = trail.name;
//   this.location = trail.location;
//   this.length = trail.length;
//   this.stars = trail.stars;
//   this.star_votes = trail.starVotes;
//   this.summary = trail.summary;
//   this.trail_url = trail.url;
//   this.conditions = trail.conditionDetails;
//   this.condition_date = trail.conditionDate.slice(0, 10);
//   this.condition_time = trail.conditionDate.slice(12);
//   this.created_at = Date.now();
// }


// // -------------------------------------------
// // MOVIES`
// // -------------------------------------------

// function moviesHandler(request, response) {
//   const location = request.query.search_query;
//   getMovies(location)
//     .then(trailsList => sendJson(trailsList, response))
//     .catch((error) => errorHandler(error, request, response));
// }


// function getMovies(location) {
//   const url = `https://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&query=${location}`;
//   console.log(url);
//   return superagent.get(url)
//     .then(data => parseMoviesData(data.body));
// }

// function parseMoviesData(data) {
//   try {
//     const movies = data.results.map(movie => {
//       return new Movie(movie);
//     });
//     return Promise.resolve(movies);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }

// function Movie(movie) {
//   this.tableName = 'movies';
//   this.title = movie.title;
//   this.overview = movie.overview;
//   this.average_votes = movie.vote_average;
//   this.total_votes = movie.vote_count;
//   this.image_url = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
//   this.popularity = movie.popularity;
//   this.released_on = movie.release_date;
//   this.created_at = Date.now();
// }

