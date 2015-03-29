function display_dictionary(genre){
    var myjson;
    var blah = "misery";
    $.getJSON("https://api.spotify.com/v1/search?query=track%3A%22" + blah + "%22&offset=0&limit=50&type=track", function(json){
        myjson = json;
        console.log(myjson);

    counter = 0;
    iteration = 0;
    tripLength = document.getElementByID('time');
    for(i = 0; i <50; i++){
        current = Math.floor((Math.random() * 50) + 1);
        if(counter + myjson.tracks.items[i].duration_ms > tripLength){
            ;
        }
        else{
            counter += myjson.tracks.items[i].duration_ms;
            iteration = i;
        }
    }
    console.log("the total song times add up to " + counter + " having gone through " + iteration + " songs when the length of the trip is " + tripLength);
    });
}

