var DAYS_IN_WEEK = 7;
var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

$('document').ready(function () {
    //Retrieves tweets for default placeholder for the first time
    getTweets($('#twitterHandlerInput').val());

    $('#submitBtn').click(function () {
        getTweets($('#twitterHandlerInput').val());
    });

    $('#twitterHandlerInput').keypress(function (event) {
        // Check the keyCode and if the user pressed Enter (code = 13) 
        if (event.keyCode == 13) {
            getTweets($('#twitterHandlerInput').val());
        }
    });

});

function getTweets(user) {
    resetComponents();

    //TODO: Currently failure is silent. UI Notification needed
    $.getJSON('http://api.twitter.com/1/statuses/user_timeline/' + user + '.json?count=200&include_rts=true&callback=?', function (data, status, xhr) {
        analyseData(data);

    }).fail(function () {
        alert("error"); //registered BUG in jQuery. Need to make a setTimeout function which reports error if not completed
    })

}

function analyseData(data) {
    if (data.length == 0) {
        $('#TweetStatus').append('No tweets recieved for this twitter handler');
    } else {
        //TODO : Currently analyzes only last 200 tweets (max limit by twitter),call more if needed (using minId as id of 200th tweet), currently handler with more than 200 tweets per week is not called
        var dayCount = new Array();
        var totalWeekCount = 0;

        for (i = 0; i < data.length; i++) {
            var dateOftweet = new Date(data[i].created_at);
            var milliSecsInADay = 1000 * 60 * 60 * 24;
            //Checks if Date of Tweet is within a week
            if ((Math.round((new Date() - dateOftweet) / milliSecsInADay) < DAYS_IN_WEEK)) { 
                totalWeekCount++;
                dayCount[dateOftweet.getDay()] = dayCount[dateOftweet.getDay()]++ ? dayCount[dateOftweet.getDay()] : 1;

            } else {
                drawOnScreen(dayCount, totalWeekCount);
                break;
            }
        }
    }
}

function resetComponents() {
    $('#TweetStatus').text('');
    $('.analysisBar').text('');
}

function drawOnScreen(dayCount, totalWeekCount) {
    resetComponents();

    //Sets count of last week
    $('#TweetStatus').append('<strong>Total Tweets in last one week: ' + totalWeekCount + '</strong>');

    //Adds bars on the page
    for (i = 0; i < DAYS_IN_WEEK; i++) {
        var dayPercentage = (dayCount[i] * 100) / (totalWeekCount) || 0;
        $('.analysisBar').append(daysOfWeek[i] + '<div class="progress progress-horizontal">' + (dayCount[i] || 0) + '<div class="bar" style="width: ' + dayPercentage + '%"></div></div>');

    }
}