/**
 * Models and collections
 */

// User and preferences model
var User = Backbone.Model.extend({
  url: function() {
    return (this.get('id')) ? 'https://soundbits.herokuapp.com/users/' + this.get('id') + '.json' :
      'https://soundbits.herokuapp.com/users.json';
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
    var s = this.get('suggestions');
    this.set('currentSuggestion', s.shift());
    this.set('suggestions', s);
    return this.get('currentSuggestion');
  },

  // Save episodes
  saveEpisodes: function() {
    var e = this.get('episodes');

    if (e && e.length > 0) {
      Backbone.sync('update', undefined, {
        url: 'https://soundbits.herokuapp.com/users/' + this.get('id') + '/episodes.json',
        attrs: this.get('episodes')
      });
    }
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
