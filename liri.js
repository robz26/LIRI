require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var keys = require('./keys.js');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

if (process.argv[2] === 'my-tweets') {
    var params = { veryimportant1: 'nodejs' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
            }
        } else {
            console.log(error);
        }
    });

}

if (process.argv[2] === 'spotify-this-song') {
    var song = JSON.stringify(process.argv[3]);
    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            if (response.tracks.total !== 0) {
                console.log(response.tracks.items[0].album.artists[0].name);
                console.log(response.tracks.items[0].name);
                console.log(response.tracks.items[0].external_urls.spotify);
                console.log(response.tracks.items[0].album.name);
            } else {
                spotify.search({ type: 'track', query: 'Ace of Base The Sign' })
                    .then(function (response) {

                        console.log(response.tracks.items[0].album.artists[0].name);
                        console.log(response.tracks.items[0].name);
                        console.log(response.tracks.items[0].external_urls.spotify);
                        console.log(response.tracks.items[0].album.name);
                    })
            }
        })
        .catch(function (err) {
            console.log(err);
        });


}
if (process.argv[2] === 'movie-this') {
    var movieName = '';
    for (var i = 3; i < process.argv.length; i++) {

        movieName += process.argv[i] + " ";
    }

    //   console.log(movieName);
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log(body);

            if (body !== '{"Response":"False","Error":"Movie not found!"}') {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("The release year is: " + JSON.parse(body).Year);
                console.log("Rated: " + JSON.parse(body).Rated);
                // console.log(JSON.parse(body).Ratings);
                JSON.parse(body).Ratings[1] ? console.log("RT Rating: " + JSON.parse(body).Ratings[1].Value) 
                : console.log("No RT data available");
                console.log("Country of Origin: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            } else {
                queryUrl = "http://www.omdbapi.com/?i=tt0485947&y=&plot=short&apikey=trilogy";
                request(queryUrl, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log("Title: " + JSON.parse(body).Title);
                        console.log("The release year is: " + JSON.parse(body).Year);
                        console.log("Rated: " + JSON.parse(body).Rated);
                        console.log("RT Rating: " + JSON.parse(body).Ratings[1].Value);
                        console.log("Country of Origin: " + JSON.parse(body).Country);
                        console.log("Language: " + JSON.parse(body).Language);
                        console.log("Plot: " + JSON.parse(body).Plot);
                        console.log("Actors: " + JSON.parse(body).Actors);
                    }
                })
            }
        }
    })
}
if (process.argv[2] === 'do-what-it-says') {

    fs.readFile('random.txt', 'UTF-8', function (err, data) {
        if (!err) {
            // console.log(data);
            dataArray = data.split(',');
            // console.log(dataArray);
            // process.argv.push(dataArray[0])
            // process.argv.push(dataArray[1])

            switch (dataArray[0]) {
                case 'spotify-this-song':
                    spotify
                        .search({ type: 'track', query: dataArray[1] })
                        .then(function (response) {
                            if (response.tracks.total !== 0) {
                                console.log(response.tracks.items[0].album.artists[0].name);
                                console.log(response.tracks.items[0].name);
                                console.log(response.tracks.items[0].external_urls.spotify);
                                console.log(response.tracks.items[0].album.name);
                            }

                        })
                    break;
                default:
                    console.log("nothing found");
            }
            // console.log(process.argv);
        }
    })

}