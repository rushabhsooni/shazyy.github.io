var TikTok = {};
var user1 = "";
var user2 = "";

var corsProxies = [
	"https://cors.livecounts.io/",
	"https://nice-cors-proxy-1.glitch.me/",
	"https://nice-cors-proxy-2.glitch.me/",
	"https://nice-cors-proxy-3.glitch.me/",
	"https://nice-cors-proxy-4.glitch.me/",
	"https://shazyy-cors-anywhere.glitch.me/",
	"https://shazyy-cors-anywhere-1.glitch.me/",
    "https://shazyy-cors-anywhere-2.glitch.me/",
    "https://nextcounts-cors01.glitch.me/",
    "https://nextcounts-cors02.glitch.me/",
    "https://nextcounts-cors03.glitch.me/",
    "https://nextcounts-cors04.glitch.me/",
    "https://nextcounts-cors05.glitch.me/",
    "https://nextcounts-cors06.glitch.me/",
    "https://nextcounts-cors07.glitch.me/",
    "https://nextcounts-cors08.glitch.me/",
    "https://nextcounts-cors09.glitch.me/",
    "https://nextcounts-cors10.glitch.me/",
    "https://nextcounts-cors11.glitch.me/",
    "https://nextcounts-cors12.glitch.me/",
]

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value
    });
    return vars
}


var chart = new Highcharts.chart({
    chart: {
        renderTo: 'chart',
        type: 'line'
    },
    title: {
        text: 'Follower Difference Graph'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: ''
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Follower Difference',
        marker: {
            enabled: false
        }
    }]
});

window.onload = () => {
    TikTok.UrlManager.addUsers();
    
	if(!getUrlVars()["u1"]){
		user1="LorenGray";
	} else {
		user1=getUrlVars()["u1"];
    }

    if(!getUrlVars()["u2"]){
		user2="TikTok";
	} else {
		user2=getUrlVars()["u2"];
    }

    TikTok.UpdateManager.updateFollowButton(user1, user2)

	
	$.getJSON(corsProxies[Math.floor(Math.random() * corsProxies.length)]+'https://www.tiktok.com/node/share/user/@'+user1,function(data) {
        $.getJSON(corsProxies[Math.floor(Math.random() * corsProxies.length)]+'https://www.tiktok.com/node/share/user/@'+user2,function(data2) {
            TikTok.UpdateManager.updateName(data.body.userData.nickName, data2.body.userData.nickName)
            TikTok.UpdateManager.updatePicture(data.body.userData.coversMedium[0], data2.body.userData.coversMedium[0])
            TikTok.UpdateManager.updateFollowers(data.body.userData.fans, data2.body.userData.fans, data.body.userData.fans - data2.body.userData.fans)
            chart.series[0].addPoint([                   
                (new Date()).getTime(),
                Math.abs(data.body.userData.fans - data2.body.userData.fans)
            ])
        })
    })
}

TikTok.UpdateManager = {
    updateName: function(a,b) {
        document.querySelector(".username1").innerText = a;
        document.querySelector(".username2").innerText = b;
    },

    updatePicture: function(a,b) {
        document.querySelector('.pfp1').src = a;
        document.querySelector('.pfp2').src = b;
    },

    updateFollowers: function(a,b,c) {
        document.querySelector(".odo1").innerHTML=a;
        document.querySelector(".odo2").innerHTML=b;
        document.querySelector(".difference-odo").innerHTML=c;
    },

    updateFollowButton: function(a,b) {
        document.querySelector(".followbutton1").innerHTML = "Follow @"+a;
        document.querySelector(".followbutton2").innerHTML = "Follow @"+b;
        document.querySelector(".followhref1").href = "https://tiktok.com/@"+a;
        document.querySelector(".followhref2").href = "https://tiktok.com/@"+b;
    }
};

TikTok.UrlManager = {
    addUsers: function() {
        if (!getUrlVars()["u1"]) {
            if (window.location.href.indexOf("?")>-1){
                history.pushState(null,'',window.location.href+'&u1='+user1)
            } else {
                history.pushState(null,'',window.location.href+'?u1='+user1);
            }
        }

        if (!getUrlVars()["u2"]) {
            if (window.location.href.indexOf("?")>-1){
                history.pushState(null,'',window.location.href+'&u2='+user2)
            } else {
                history.pushState(null,'',window.location.href+'?u2='+user2);
            }
        }
    }
}

//hide disqus ads
setInterval(() => {
    $.each($('iframe'), (arr,x) => {
        let src = $(x).attr('src');
        if (src && src.match(/(ads-iframe)|(disqusads)/gi)) {
            $(x).remove();
        }
    });
}, 300);

setInterval(function() {
    var today = new Date();
    $.getJSON(corsProxies[Math.floor(Math.random() * corsProxies.length)]+'https://www.tiktok.com/node/share/user/@'+user1,function(data) {
        $.getJSON(corsProxies[Math.floor(Math.random() * corsProxies.length)]+'https://www.tiktok.com/node/share/user/@'+user2,function(data2) {
            TikTok.UpdateManager.updateFollowers(data.body.userData.fans, data2.body.userData.fans, data.body.userData.fans - data2.body.userData.fans)
            chart.series[0].addPoint([                   
                (new Date()).getTime(),
                Math.abs(data.body.userData.fans - data2.body.userData.fans)
            ])

            if (chart.series[0].data.length >= 900) {
                chart.series[0].data[0].remove()
            }
        })
    })
}, 2000)

function search1() {
    var replaceurl = document.getElementById('search1').value.replace(" ", "").replace("@", "");
    window.location.href = '/tiktok-realtime/compare/?u1=' +replaceurl+'&u2='+user2;
}

function search2() {
    var replaceurl = document.getElementById('search2').value.replace(" ", "").replace("@", "");
    window.location.href = '/tiktok-realtime/compare/?u1='+user1+'&u2='+replaceurl;
}

$("#searchbutton1").click(function(){
	search1();
})

$("#searchbutton2").click(function(){
	search2();
})

document.getElementById("search1").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        search1()
    }
})

document.getElementById("search2").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        search2()
    }
})