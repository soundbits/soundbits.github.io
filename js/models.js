/**
 * Models and collections
 */

// User and preferences model

// host = "https://soundbits.herokuapp.com"
host = "http://localhost:3000"
var User = Backbone.Model.extend({
  url: function() {
    return (this.get('id')) ? host+'/users/' + this.get('id') + '.json' :
      host+'/users.json';
  },

  initialize: function() {
    var _this = this;
    this.loadLocal();

    // When the ID changes, then let's save that locally
    this.on('change:id', function() {
      localStorage.setItem('currentID', this.get('id'));
    });

    // When suggestion changes, get a new one to load
    this.on('change:suggestions', function() {
      if (!_this.get('currentSuggestion')) {
        _this.getNewSuggestion();
      }
    });

    // Mark as fetched
    this.on('sync', function() {
      this.set('fetched', true);
    });
  },

  // Load ID from local storage
  loadLocal: function() {
    var _this = this;
    var id = localStorage.getItem('currentID');

    if (id) {
      this.set('id', id);
      this.fetch()
        .error(function() {
          _this.unset('id');
          _this.resetLocal();
        });
    }
  },

  // Reset local storage
  resetLocal: function() {
    localStorage.removeItem('currentID');
    this.clear();
  },

  // Save and fetch
  saveFetch: function() {
    var _this = this;
    this.save().success(function() {
      _this.fetch();
    });
  },

  // Get a new suggestion, shifting it from the suggestions array
  getNewSuggestion: function() {
    console.log('loading');
    var s = this.get('suggestions');
    this.set('currentSuggestion', s.shift());
    this.set('suggestions', s);
    return this.get('currentSuggestion');
  },

  // Save episodes addition
  saveEpisode: function(episode) {
    
    Backbone.sync('create', undefined, {
      url: host+'/users/' + this.get('id') + '/add_episode/'+episode.id+'.json'
    });
  },

  // Save rejection addition
  saveRejection: function(episode) {
    Backbone.sync('create', undefined, {
      url: host+'/users/' + this.get('id') + '/add_rejection/'+episode.id+'.json'
    });
  }
});

// Episodes and shows
var Episode = Backbone.Model.extend({
});

var Show = Backbone.Model.extend({
});

var Episodes = Backbone.Collection.extend({
  model: Episode
});

var Shows = Backbone.Collection.extend({
  model: Show
});
