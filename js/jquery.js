function apiGetPosts(successCallback, errorCallback) {

    $.ajax({
        url: api_url + 'api/posts',
        success: successCallback,
        error : errorCallback
    });
    
}

function apiInsertPost(data, successCallback, errorCallback) {

    $.ajax({
        type: "POST",
        data : data,
        url: api_url + 'api/posts',
        success: successCallback,
        error : errorCallback
      });
}

function apiRegister(data, successCallback, errorCallback) {

    $.ajax({
        type: "POST",
        data : data,
        url: api_url + 'api/register',
        success: successCallback,
        error : errorCallback
      });
}

function apiLogin(data, successCallback, errorCallback) {

    $.ajax({
        type: "POST",
        data : data,
        url: api_url + 'api/login',
        success: successCallback,
        error : errorCallback
      });
}