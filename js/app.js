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
  el: '#container',
  template: '#template',
  data: {
  	showList: false,
  	currentSuggestion: undefined,
  	user: {
  		id: undefined,
  		episodes: [],
  		suggestions: [
	  		{
	  			episodeName: 'Reply All Exploder',
	  			show: 'Reply All'
	  		},
	  		{
	  			episodeName: 'Undo Undo Undo',
	  			show: 'Reply All'
	  		}
  		],
  		rejections: []
  	},
  	shows: ['This American Life', 'Reply All', '99% Invisible', 'Radiolab', 'Morning Edition', 'Fresh Air', 'Star Talk', 'On the Media'],
  	selectedShows: []
  },
  getSuggestion: function() {
  	var shows = this.get('user.suggestions');
  	var suggestion = shows.shift();
  	console.log(suggestion);
  	this.set('user.suggestions', shows);
  	return suggestion;
  }
});

ractive.on('selectShow', function(event, showName) {
	this.push('selectedShows', showName);
});

ractive.on('showOptions', function(event) {
	this.set('user.id', 369);
	this.set('currentSuggestion', this.getSuggestion());
});

ractive.on('processSuggestion', function(event) {
	console.log(event);
	if (event.original.direction == 4) {
		// swipe right
		this.push('user.episodes', this.get('currentSuggestion'));
	} else if (event.original.direction == 2) {
		// swipe left
		this.push('user.rejections', this.get('currentSuggestion'));
	}
	var nextSuggestion = this.getSuggestion();
	if (nextSuggestion) {
		this.set('currentSuggestion', nextSuggestion);
	} else {
		this.set({
			currentSuggestion: undefined,
			showList: true
		});
	}
});