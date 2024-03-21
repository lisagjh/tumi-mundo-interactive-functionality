// Import the Express.js module
import express, { response } from "express";

// Import the fetchJson function from a custom helper file
import fetchJson from "./helpers/fetch-json.js";

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

// array voor de gelikede playlists / stories ?

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

app.get("/playlist/:slug", function (request, response) {
  fetchJson(apiUrl + "/tm_playlist?fields=slug" + request.params.slug).then((apiData) => {
    response.render("playlist-detail", {
      stories: storiesData.data,
      playlists: playlistsData.data,
      favs: favs,
    })
  })
})


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log(`Application started on http://localhost:${PORT}`);
});