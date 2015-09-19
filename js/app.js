console.log('run')

var landingPage = $(".landing");
var userType = $(".user-type");
var newPodcastUserButton = $(".new-to-podcasts")
var existingPodcastUserButton = $(".has-podcasts")

landingPage.on('click', skipLandingPage)

var skipLandingPage = function () {
	console.log('skip')
	landingPage.hide();

}