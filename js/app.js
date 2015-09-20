
/**
 * Main JS
 */


// Get user container.  Will attempt to see if stored in local storage.
var user = new User();

// Main template
var ractive = new Ractive({
  el: '#container',
  template: '#template',
  data: {
  	showList: false,
  	currentSuggestion: undefined,
  	user: user,
  	shows: ['This American Life', 'Reply All', '99% Invisible', 'Radiolab', 'Morning Edition', 'Fresh Air', 'Star Talk', 'On the Media'],
  	selectedShows: []
  },
  getSuggestion: function() {
  	var shows = this.get('user.suggestions');
  	var suggestion = shows.shift();
  	this.set('user.suggestions', shows);
  	return suggestion;
  }
});

ractive.on('selectShow', function(event, showName) {
	this.push('selectedShows', showName);
});

// Show main options, save new user
ractive.on('showOptions', function(event) {
	var user = this.get('user');
	user.save();

	// TODO: Do this right when save is done
	this.set('currentSuggestion', this.getSuggestion());
});

ractive.on('processSuggestion', function(event) {
	if (event.original.direction == 4) {
		// swipe right
		this.push('user.episodes', this.get('currentSuggestion'));
	}
	else if (event.original.direction == 2) {
		// swipe left
		this.push('user.rejections', this.get('currentSuggestion'));
	}
	else {
		return;
	}

	var nextSuggestion = this.getSuggestion();
	if (nextSuggestion) {
		this.set('currentSuggestion', nextSuggestion);
	}
	else {
		this.set({
			currentSuggestion: undefined,
			showList: true
		});
	}
});
