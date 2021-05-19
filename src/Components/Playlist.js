import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";

function Playlist(props) {
  let [volume, setVolume] = useState(50);
  let [pauseSwitch, setPauseSwitch] = useState("none");
  let [playSwitch, setPlaySwitch] = useState("block");
  let [alert, setAlert] = useState(false);
  let seasonInterval = Math.floor(props.playlist.length / 4);
  let [season, setSeason] = useState(props.playlist);
  let [background, setBackground] = useState(
    "linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)"
  );
  let [seasonWord, setSeasonWord] = useState("All Seasons");

  let effectChange = props.playlist;

  useEffect(() => {
    pause();
    setSeasonWord("All Seasons");
    setBackground("linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)");
    setSeason(effectChange);
  }, [effectChange]);

  function play(track) {
    let newUris = [];
    for (let i = season.indexOf(track); i < season.length; i++) {
      newUris.push(season[i].uri);
    }

    fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${props.playerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.access}`,
        },
        body: JSON.stringify({ uris: newUris }),
      }
    );
  }

  //self-explanatory pause function for player
  function pause() {
    fetch(
      `https://api.spotify.com/v1/me/player/pause?device_id=${props.playerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.access}`,
        },
      }
    );
  }
  //sets volume using state and onChange (this does a lot of API calls)
  function volumeCall(event) {
    let newVol = event.target.value;
    setVolume(event.target.value);
    fetch(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVol}&device_id=${props.playerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.access}`,
        },
      }
    );
  }
  //special play function to resume play if paused
  function playerPlay() {
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.access}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((json) => {
        //won't do anything if something is playing
        if (!json || json.is_playing === true) {
          return;
        }
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${props.playerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${props.access}`,
            },
          }
        );
      });
    setPauseSwitch(0);
  }

  //skips one item backwards or forwards in playlist array
  function playNextOrPrevious(event) {
    //lets button id stay through fetch
    event.persist();
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.access}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((json) => {
        if (!json) {
          return;
        }
        let playing = { uri: json.item.uri };
        let next = "";
        let previous = "";
        //use uri that's currently playing to search for current index in playlist
        for (let i = 0; i < season.length; i++) {
          if (season[i].uri === playing.uri) {
            next = season[i + 1];
            previous = season[i - 1];
            break;
          }
        }
        if (event.target.id === "next") {
          play(next);
        } else if (event.target.id === "previous") {
          play(previous);
        }
      })
      .catch((err) => console.log(err));
  }
  //TODO: separate into player component again

  async function createPlaylist() {
    //setup
    let name = `${props.artist.name} - ${seasonWord}`;
    let id = "";
    let uris = [];
    let data = JSON.stringify({
      name: `${name}`,
      description: "A glorious playlist from Ying Yang Twins for all seasons",
      public: "false",
    });
    season.forEach((song) => uris.push(song.uri));

    //create playlist endpoint
    await fetch(`https://api.spotify.com/v1/users/${props.userId}/playlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.access}`,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((json) => {
        async function setId() {
          id = await json.id;
        }
        setId();
      })
      .catch((err) => console.log(err))
      .then(() => {
        //add playlist
        fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.access}`,
          },
          body: JSON.stringify(uris),
        }).then((res) => res.json());
      })
      .catch((err) => console.log(err));
  }

  return (
    <div
      style={{
        backgroundColor: "#EDAEFF",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "90vw",
          margin: "5vw",
          justifyContent: "space-evenly",
          alignItems: "center",
          maxWidth: "600px",
          border: "2px solid black",
          padding: "10px",
          borderRadius: "10px",
          background: background,
        }}
      >
        <img
          alt="album cover"
          style={{
            marginTop: "5px",
            marginLeft: "15px",
            maxHeight: "64px",
            maxWidth: "64px",
          }}
          src={props.currentlyPlaying.cover}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80vw",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {props.currentlyPlaying.name}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "space-evenly",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {props.currentlyPlaying.artists.map((x) => "- " + x.name + " - ")}
            </p>
          </div>

          <div style={{ display: "flex" }}>
            <button>
              <svg
                id="previous"
                onClick={playNextOrPrevious}
                width="1.5em"
                height="1.5em"
                viewBox="0 0 16 16"
                class="bi bi-arrow-90deg-left"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4z"
                />
              </svg>
            </button>
            <button style={{ display: playSwitch }}>
              <svg
                onClick={() => {
                  pause();
                  setPauseSwitch("block");
                  setPlaySwitch("none");
                }}
                width="1.5em"
                height="1.5em"
                viewBox="0 0 16 16"
                class="bi bi-pause"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"
                />
              </svg>
            </button>
            <button style={{ display: pauseSwitch }}>
              <svg
                onClick={() => {
                  playerPlay();
                  setPlaySwitch("block");
                  setPauseSwitch("none");
                }}
                width="1.5em"
                height="1.5em"
                viewBox="0 0 16 16"
                class="bi bi-play"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
                />
              </svg>
            </button>
            <button>
              <svg
                id="next"
                onClick={playNextOrPrevious}
                width="1.5em"
                height="1.5em"
                viewBox="0 0 16 16"
                class="bi bi-arrow-90deg-right"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M14.854 4.854a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 4H3.5A2.5 2.5 0 0 0 1 6.5v8a.5.5 0 0 0 1 0v-8A1.5 1.5 0 0 1 3.5 5h9.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4z"
                />
              </svg>
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={volume}
            onInput={(event) => volumeCall(event)}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          textDecoration: "underline",
          borderBottom: "2px solid black",
          borderTop: "2px solid black",
          width: "100vw",
          marginBottom: "2vh",
          marginTop: "10px",
        }}
      >
        <button
          onClick={() => {
            setBackground("linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)");
            setSeason(props.playlist);
            setSeasonWord("All Seasons");
          }}
        >
          all
        </button>

        <button
          onClick={() => {
            setSeason(props.playlist.slice(0, seasonInterval));
            setBackground("linear-gradient(#FF5629, #FFFFFF)");
            setSeasonWord("Summer");
          }}
        >
          summer
        </button>
        <button
          onClick={() => {
            setBackground("linear-gradient(#F2FD89, #FFFFFF)");
            setSeason(
              props.playlist.slice(seasonInterval, seasonInterval * 2 + 1)
            );
            setSeasonWord("Spring");
          }}
        >
          spring
        </button>
        <button
          onClick={() => {
            setBackground("linear-gradient(#FF9129 , #FFFFFF)");
            setSeason(
              props.playlist.slice(seasonInterval * 2, seasonInterval * 3 + 1)
            );
            setSeasonWord("Fall");
          }}
        >
          fall
        </button>
        <button
          onClick={() => {
            setBackground("linear-gradient(#6CFFDB, #FFFFFF)");
            setSeason(props.playlist.slice(seasonInterval * 3));
            setSeasonWord("Winter");
          }}
        >
          winter
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "90vw",
          maxWidth: "600px",
          marginLeft: "5vw",
          marginRight: "5vw",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",

            maxWidth: "600px",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontFamily: "'Sacramento', cursive",
              margin: "5px",
            }}
          >
            {seasonWord}
          </h1>
          <button
            style={{ fontSize: "14px", marginBottom: "12.5px" }}
            onClick={() => {
              createPlaylist();
              setAlert(true);
            }}
          >
            Save to Spotify
          </button>
        </div>

        {alert ? (
          <Alert variant="success" onClose={() => setAlert(false)} dismissible>
            <h3>SAVED</h3>
          </Alert>
        ) : (
          <div></div>
        )}
        <div style={{ maxWidth: "600px", width: "90vw", marginBottom: "20px" }}>
          <ListGroup
            style={{
              background: background,
              border: "2px solid black",
              borderRadius: "10px",
            }}
          >
            {season.map((track) => {
              return (
                <ListGroup.Item
                  onClick={() => {
                    play(track);
                  }}
                  variant="flush"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "7vh",
                    background: "transparent",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  <h5 style={{ fontSize: "14px" }}>
                    {track.seasonScore} - {track.name}
                  </h5>
                  <button
                    style={{ borderBottom: "none" }}
                    onClick={() => {
                      play(track);
                    }}
                  >
                    <svg
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 16 16"
                      class="bi bi-play"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
                      />
                    </svg>
                  </button>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
