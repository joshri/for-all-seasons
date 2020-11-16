# Ying Yang Twins For All Seasons

## Project Description:

Ying Yang Twings For All Seasons provides you with a playlist generated by the Spotify API filtering the entire Ying Yang Twins library of non-stop hits by three qualities: danceability, energy, and valence. I'm using the 50 most popular songs and filtering out repeats and remixes as best I can - so at the very least you're getting a playlist with the artist's 50 most popular songs as determined by Spotify. 

You can change the artist with a search bar, test out the playlist with my hand-crafted (artisanal) music player using more Spotify API calls, and even save the playlist to your Spotify account if you like it enough. 

## Wireframe:

https://drive.google.com/file/d/1pAQX-b_l6eKToCIMhFS_Jz5Pzt8YDhzV/view?usp=sharing

## MVP User Stories:

- As a User, I just want to listen to the Ying Yang Twins entire catalog sorted by associated season (Create Playlists with Spotify API)
- As a User, I just want to know what I'm looking at. (Header with changing artist title and about)
- As a User, I want to know what I'm listening to. (Have some player functionality with Spotify Player (potentially))
- As a User, I want to be able to put in my favorite artist, not the stinky Ying Yang Twins (search bar component - stretch for alphabetical API pull?)

## Stretch:

- Save playlists to your Spotify account with Spotify Authentication
- Curate playlists for potential accuracy (might have to save playlists to my own account and edit, then link to playlists on website.)
- Be able to do seasonal playlist with different weights for danceability, etc...modifying the algorithm.
- STYLE
- Use Spotify's Recommendations to extend playlist length for an infinite season
- Playlist Component details - adding as much info about current song as possible
  onto the page (potentially using a second API - TheAudioDB)

## Future Goals (updated as of 9/24/20):
- FIXED: loading a different artist while song is playing does not stop playback and can cause DOUBLE PLAYBACK DISASTER
- FIXED: switching artists does not reset season styling or currently playing.
- FIXED: Range input is one step behind due to onChange
- !!!!! Add Error handling and refresh token
- Add transitions to components with framer motion

## API:

#### Spotify (https://developer.spotify.com/documentation/web-api/)

## Technology:

- Javascript
- React/React Hooks
- Spotify API/Spotify Player SDK
- React Bootstrap
- Passport/Passport Spotify
- ScriptCache
