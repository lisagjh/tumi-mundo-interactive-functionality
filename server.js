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

  console.log(url);
  fetchJson(url).then((playlistData) => {
    console.log("pipo", playlistData);
    response.render("playlist-detail", {
      playlist: playlistData.data,
      stories: storiesData.data,
    });
  });
});

//! post voor fav playlists

// route voor posten van de fav playlists
app.post("/playlist/:slug", (request, response) => {
  // zoek in array of de playlist favoriet is
  let huidig = favs.find((favs) => {
    return favs.slug == request.params.slug;
  });
  //als dit nog niet bestaat maken we favs aan
  if (favs == undefined) {
    favs.push({
      slug: request.params.slug,
      favs: 1,
    });
  }
  // als het wel bestaat verwijderen uit favs
  //! weet niet of dit klopt
  else {
    huidig.favs--;
  }
  response.redirect(301, `/playlist/${request.params.slug}`);
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log(`Application started on http://localhost:${PORT}`);
});
