YT.live = {
    channelID: "",
    update: function () {
        $.getJSON('https://api.livecounts.io/yt_subs', function(data) {
            $.getJSON("https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + this.channelID + "&key=" + YT.keyManager.getKey(), function (e) {
                var result = data.filter(x => x.cid === this.channelID);
                if (result.length != 0) {
                    YT.updateManager.updateSubscribers(result[0].subscriberCount)
                    YT.updateManager.updateViews(e.items[0].statistics.viewCount);
                    YT.updateManager.updateVideos(e.items[0].statistics.videoCount);
                } else {
                    if (e.pageInfo.totalResults > 0) {
                        YT.updateManager.updateSubscribers(e.items[0].statistics.subscriberCount);
                        YT.updateManager.updateViews(e.items[0].statistics.viewCount);
                        YT.updateManager.updateVideos(e.items[0].statistics.videoCount);
                    } else {
                        YT.query.newSearch(YT.live.channelID);
                    }
                }
            }).fail(function() {
                $.getJSON('https://reeeeeeeeee.livecounts.io/yt_data?type=channel&part=statistics&id='+this.channelID, function(e) {
                    YT.updateManager.updateSubscribers(e.statistics.subscriberCount);
                    YT.updateManager.updateViews(e.statistics.viewCount);
                    YT.updateManager.updateVideos(e.statistics.videoCount);
                })
            })
        })
    },
    timer: null,
    start: function () {
        this.stop();
        this.timer = setInterval(function (e) {
            YT.live.update();
        }, 2500);
        YT.live.update();
    },
    stop: function () {
        clearInterval(this.timer);
    }
};