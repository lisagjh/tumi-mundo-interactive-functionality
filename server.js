// Import the Express.js module
import express, { request, response } from "express";

// Import the fetchJson function from a custom helper file
import fetchJson from "./helpers/fetch-json.js";
import { resolveInclude } from "ejs";

// Set the base API endpoint
const apiUrl = "https://fdnd-agency.directus.app/items";

//  `${apiUrl}/tm_playlist?filter{"slug": "${request.params.slug}"}`
// Create a new Express app
const app = express();

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

const storiesData = await fetchJson(apiUrl + "/tm_story");
const playlistsData = await fetchJson(apiUrl + "/tm_playlist");

// array voor de gelikede playlists / stories

let favs = [];

// route voor homepage
app.get("/", function (request, response) {
  // Haal alle personen uit de WHOIS API op
  fetchJson(apiUrl).then((apiData) => {
    response.render("home", {
      stories: storiesData.data,
      playlists: playlistsData.data,
      favs: favs,
    });
  });
});

// Maak een GET route voor een detailpagina met een request parameter id
app.get("/playlists", function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + "/tm_playlist" + request.params.id).then((apiData) => {
    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render("playlists", {
      stories: storiesData.data,
      playlists: playlistsData.data,
      favs: favs,
    });
  });
});

// detail pagina playlist

app.get("/playlist/:slug", function (request, response) {
  const url = `${apiUrl}/tm_playlist?filter={"slug":{"_eq":"${request.params.slug}"}}`;

  fetchJson(url).then((playlistData) => {
    response.render("playlist-detail", {
      playlist: playlistData.data,
      stories: storiesData.data,
      favs: favs,
    });
  });
});

//! post voor maken van playlists

// POST route for creating a new playlist
app.post("/playlist/create", function (request, response) {
  // Extract data from the request body
  const { title, coverImage, description, selectedStories } = request.body;

  // You can then process this data (e.g., save it to a database)
  // For now, we'll just log the data
  console.log("New Playlist Data:", { title, coverImage, description, selectedStories });

  // Redirect to the home page after playlist creation
  response.redirect("/");
});


//! post voor fav playlists

// POST route for liking a playlist
app.post("/playlist/:slug/like", function (request, response) {
  // Extract the playlist ID from the request parameters
  const playlistSlug = request.params.slug;

  // Check if the playlist ID exists
  const playlist = playlistsData.data.find(
    (playlist) => playlist.slug === playlistSlug
  );

  // If the playlist is found, add it to the favs array
  if (playlist) {
    // Check if the playlist is already in the favs array
    if (!favs.some(item => item.slug === playlist.slug)) {
      // Add the playlist to the favs array
      favs.push(playlist);
      console.log("Playlist added to favs:", playlist);
    } else {
      console.log("Playlist is already in favs:", playlist);
    }
  } else {
    console.log("Playlist not found with slug:", playlistSlug);
  }

  // Redirect back to the home page after liking the playlist
  response.redirect(303, '/')
});


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log(`Application started on http://localhost:${PORT}`);
});
