const itemWidth = 253
const nextPlaylist = document.querySelector('.playlist-next-btn')
const prevPlaylist = document.querySelector('.playlist-prev-btn')
const listPlaylist = document.querySelector('.playlist-container')


prevPlaylist.addEventListener("click", function(){
    console.log("click")
    listPlaylist.scrollLeft -= itemWidth;
})

nextPlaylist.addEventListener("click", function(){
    listPlaylist.scrollLeft += itemWidth;
})
