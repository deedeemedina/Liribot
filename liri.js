require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var dataArr;
var command = process.argv[2];
var argument = [];
for (var i = 3; i < process.argv.length; i++) {
  argument.push(process.argv[i]);
}

var argString = argument.join(" ");

if (command === "concert-this") {
  concertThis(argString);
} else if (command === "spotify-this-song") {
  console.log(
    "For better results search add the Artists name to your argument:"
  );
  spotifyThisSong(argString);
} else if (command === "movie-this") {
  movieThis(argString);
} else if (command === "do-what-it-says") {
  doWhatItSays();
} else {
  console.log("You've input an incorrect command.");
}

function concertThis(argument) {
  if (argument.length < 1) {
    return console.log(
      "Error, no artist selected. Try again with the name of an artist."
    );
  }
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        argString.toString() +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      console.log("Here are the following events for " + argString);
      console.log("*********************************************************");
      response.data.forEach(function(event) {
        console.log("Venue Name:", event.venue.name);
        console.log(
          "Venue Location:",
          event.venue.city +
            " " +
            event.venue.region +
            " " +
            event.venue.country
        );
        console.log(
          "Venue Time: ",
          moment(event.datetime).format("MM/DD/YYYY, h:mm a")
        );
        console.log(
          "*********************************************************"
        );
      });
    });
}

function spotifyThisSong(arg) {
  if (argument.length < 1) {
    spotify.search({ type: "track", query: "The Sign Ace of Base" }, function(
      err,
      data
    ) {
      if (err) {
        return console.log("Error: " + err);
      }
      console.log("No song is being played: Here is a default track");
      console.log("Song:", data.tracks.items[0].name);
      console.log("Artist(s):", data.tracks.items[0].artists[0].name);
      if (data.tracks.items[i].preview_url === null) {
        console.log("No Preview URL");
      } else {
        console.log("Preview URL:", data.tracks.items[0].preview_url);
      }
      console.log("Album:", data.tracks.items[0].album.name);
      console.log("********************************");
    });
  } else {
    spotify.search({ type: "track", limit: 1, query: arg }, function(
      err,
      data
    ) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      console.log("********************************");
      for (var i = 0; i < data.tracks.items.length; i++) {
        console.log("Song:", data.tracks.items[i].name);
        console.log("Artist(s):", data.tracks.items[i].artists[0].name);
        if (data.tracks.items[i].preview_url === null) {
          console.log("No Preview URL");
        } else {
          console.log("Preview URL:", data.tracks.items[i].preview_url);
        }
        console.log("Album:", data.tracks.items[i].album.name);
        console.log("********************************");
      }
    });
  }
}

function movieThis(argument) {
  if (argument === undefined || argument.length < 1) {
    return console.log(
      "If you haven't watched 'Mr. Bean,' then you should: http://www.imdb.com/title/tt0485947/"
    );
  }
  axios
    .get(
      "http://www.omdbapi.com/?i=" + argument + "tt3896198&apikey=32ac3d38"
    )
    .then(function(response) {
      console.log("Title:", response.data.Title);
      console.log("Year:", response.data.Year);
      console.log("IMDB Rating:", response.data.imdbRating);
      console.log("Rotten Tomatoes Rating:", response.data.Metascore);
      console.log("Country:", response.data.Country);
      console.log("Language(s):", response.data.Language);
      console.log("Plot:", response.data.Plot);
      console.log("Actors:", response.data.Actors);
      console.log("********************************");
    });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // We will then print the contents of data
    // Then split it by commas (to make it more readable)
    dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    if (dataArr.length > 1) {
      argument.push(dataArr[1]);
      argString = dataArr[1];
      argString = argString.replace(/["]/g, "");
    }

    if (dataArr[0] === "concert-this") {
      concertThis(dataArr[1]);
    } else if (dataArr[0] === "spotify-this-song") {
      console.log();
      console.log(
        "For better results search add the Artists name to your argument:"
      );
      spotifyThisSong(dataArr[1]);
    } else if (dataArr[0] === "movie-this") {
      movieThis(dataArr[1]);
    } else {
      console.log("You've input an incorrect command.");
    }
  });
}

fs.appendFile("list.txt", command + " " + argString + "\n", function(err) {
  // If the code experiences any errors it will log the error to the console.
  if (err) {
    return console.log(err);
  }

  // Otherwise, it will print: "movies.txt was updated!"
  console.log("********************************");
  console.log("list.txt was updated!");
  console.log("********************************");
});
