// Options
const CLIENT_ID = '418459077117-pchij1fu3469ktv49k3an6du5oc8vlko.apps.googleusercontent.com';
const DISCOVERY_DOCS = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'goshufit';

Form submit and change channel
channelForm.addEventListener('submit', e => {
    e.preventDefault();

    const channel = channelInput.value;

    getChannel(channel);
})

// Load auth2 library
function handleClientLoad() {
    //The load() method loads data from a server and puts the returned data into the selected element.
    gapi.load('client:auth2', initClient);
}

// Init API client library and set up sign in listeners
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {
        //Listen for sign in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        //Handle initial sign in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

//Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'block';
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}

//Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

//Handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

//Display channel data
function showChannelData(data) {
    const channelData = document.getElementById('channel-data');
    channelData.innerHTML = data;
}

//Get channel form API
function getChannel(channel) {
    gapi.clent.youtube.channels.list({
        part: 'snippet, contentDetails, statistics',
        forUsername: channel
    })
        .then(response => {
            console.log(response)
            const channel = response.result.items[0]

            const output = `
        <ul class="collection">
        <li class ="collection-item">Title: ${channel.snippet.title}</li>
        <li class ="collection-item">ID: ${channel.id}</li>
        <li class ="collection-item">Subscribers: ${numberWithCommas(channel.statistics.subdcriberCount)}</li>
        <li class ="collection-item">Views: ${numberWithCommas(channel.statistics.viewCount)}</li>
        <li class ="collection-item">Videos: ${numberWithCommas(channel.statistics.videoCount)}</li>
        </ul>
        <p>${channel.snippet.description}</p>
        <hr>
        <a class="btn grey darken-2" target="blank" href="http://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
        `;
            showChannelData(output);

            const playListId = channel.contentDetails.relatedPlaylists.uploads;
            requestVideoPlaylist(playListId);
        })
        .catch(err => alert('No Channel By That Name'));
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function requestVideoPlayList(playListId) {
    const requestOptions = {
        playListId: playListId,
        part: 'snippet',
        maxResults: 10
    }

    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(response => {
        console.log(response);
        const playListItems = response.result.items;
        if (playListItems) {
            let output = '<br><h4 class="center-align">Latest Videos</h4>';

            //Loop through videos and append output
            playListItems.forEach(item => {
                const videoId = item.snippet.resourceId.videoId;

                output += `
                <div class="col s3">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                `
            });

            // Output videos
            videoContainer.innerHTML = output;
        } else {
            videoContainer.innerHTML = 'No Uploaded Videos'
        }
    });
} 