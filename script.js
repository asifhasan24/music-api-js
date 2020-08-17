// Event Handler on Search Button
document.getElementById("search-button").addEventListener("click", () => {
  const resultArray = [];
  const searchedWord = document.getElementById("search-bar").value;

  // Fetch the search result promise and resolve it into response
  fetch(`https://api.lyrics.ovh/suggest/${searchedWord}`)
    .then((response) => response.json())
    .then((returnedData) => {
      // Store 10 Search Results in an Array
      for (let i = 0; i < 10; i++) {
        resultArray.push(returnedData.data[i]);
      }

      // Check if there's already a list. If yes, then loop over the list and remove the items
      const parent = document.getElementById("search-result-list");
      while (parent.firstChild) {
        parent.firstChild.remove();
      }

      // Work on individual result
      resultArray.forEach((el, i) => {
        let title = returnedData.data[i].title;
        let artist = returnedData.data[i].artist.name;
        let album = returnedData.data[i].album.title;

        // Create html for the DOM
        let searchResultHtml = `<div class="single-result row align-items-center my-3 p-3">
                <div class="col-md-9">
                    <h3 class="lyrics-name song-title-${i}">${title}</h3>
                    <p class="author lead">Album : ${album} </br>
                    -by <span class="song-artist-${i}">${artist}</span></p>
                </div>
                <div class="col-md-3 text-md-right text-center">
                    <button id="${i}" class="btn btn-success lyrics-button">Get Lyrics</button>
                </div>
        <pre id="whole-lyrics-${i}" class="lyric text-center text-white">
        </pre>
            </div>`;
        // Push the html into the DOM
        document
          .getElementById("search-result-list")
          .insertAdjacentHTML("beforeend", searchResultHtml);
      });

      // Adding event handlers on each button
      const searchResultList = document.getElementsByClassName("lyrics-button");
      for (let i = 0; i < searchResultList.length; i++) {
        searchResultList[i].addEventListener("click", () => {
          let artist, title;

          artist = document.querySelector(`.song-artist-${i}`).innerHTML;
          title = document.querySelector(`.song-title-${i}`).innerHTML;

          // Fetch Lyrics from API
          fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
            .then((response) => {
              // Check if the lyrics exists or not
              if (response.ok === false) {
                document.getElementById(`whole-lyrics-${i}`).innerHTML =
                  "Sorry, no lyrics found on the database";
                return;
              } else return response.json();
            })
            .then((data) => {
              let lyrics = data.lyrics;
              document.getElementById(`whole-lyrics-${i}`).innerHTML = lyrics;
            })
            .catch((error) => console.log(`Error Found`));
        });
      }
    });
});
