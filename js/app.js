
var api_url = 'http://localhost:3000/';


function getPosts(successCallback, errorCallback) {

    $.ajax({
        url: api_url + 'api/posts',
        success: successCallback,
        error : errorCallback
    });
}

function insertPost(data, successCallback, errorCallback) {

    $.ajax({
        type: "POST",
        url: api_url + 'api/posts',
        data: data,
        crossDomain: true,
        dataType: "json",
        contentType: 'application/x-www-form-urlencoded', 
        xhrFields: { withCredentials: true }, 
        success: successCallback,
        error : errorCallback
      });
}

function createPostItem(data) {
    let item = `
        <div class="card card-body bg-light">
            <div>${data.post}</div>
            <div>${data.user}</div>
        </div>
    `;

    return item;
}

function insertIntoFeed(item) {
    $('#feed').append(item);
}