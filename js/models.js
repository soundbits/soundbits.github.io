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
    this.loadLocal();

    // When the ID changes, then let's save that locally
    this.on('change:id', function() {
      localStorage.setItem('currentID', this.get('id'));
    });
  },

  // Load ID from local storage
  loadLocal: function() {
    var id = localStorage.getItem('currentID');

    if (id) {
      this.set('id', id);
      this.fetch();
    }
  },

  // Reset local storage
  resetLocal: function() {
    localStorage.removeItem('currentID');
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
