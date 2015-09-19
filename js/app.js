var ractive = new Ractive({
  // The `el` option can be a node, an ID, or a CSS selector.
  el: '#container',

  // We could pass in a string, but for the sake of convenience
  // we're passing the ID of the <script> tag above.
  template: '#template',

  // Here, we're passing in some initial data
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