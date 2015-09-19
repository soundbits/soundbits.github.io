console.log('run')

var $landingPage = null;
var $userType = null;
var $newPodcastUserButton = null;
var $existingPodcastUserButton = null;

var onDocumentLoad = function(e) {

$landingPage = $(".landing");
$userType = $(".user-type");
$newPodcastUserButton = $(".new-to-podcasts");
$existingPodcastUserButton = $(".has-podcasts");


setTimeout(skipLandingPage, 100);

}

// landingPage.on('click', skipLandingPage)

var skipLandingPage = function () {
	console.log('skip')
	$landingPage.hide();
}
var ractive = new Ractive({
  // The `el` option can be a node, an ID, or a CSS selector.
  el: '#container',

  // We could pass in a string, but for the sake of convenience
  // we're passing the ID of the <script> tag above.
  template: '#template',

  // Here, we're passing in some initial data
  data: {
  	user: {
  		id: undefined
  	},
  	shows: ['This American Life', 'Reply All', '99% Invisible', 'Radiolab', 'Morning Edition', 'Fresh Air', 'Star Talk', 'On the Media'],
  	selectedShows: []
  },

  selectShow: function() {
  	
  }
});