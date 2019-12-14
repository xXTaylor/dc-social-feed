
var api_url = 'http://localhost:3000/';

function createPostItem(data) {
    let item = `
        <div class="card card-body bg-light mb-4">
            <h3>${data.title}</h3>
            <small>Left By: ${data.name}</small>
            <div class="lead">${data.body}</div>
        </div>
    `;

    return item;
}


function insertIntoFeed(item) {
    $('#feed').append(item);
    //document.getElementById(feed).append(item);
}