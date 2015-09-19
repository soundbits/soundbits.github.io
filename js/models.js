/**
 * Models and collections
 */

// User and preferences model
var User = Backbone.Model.extend({
  urlRoot: 'https://soundbits.herokuapp.com/users',

  initialize: function() {
    // When the ID changes, then let's save that locally
    this.on('change:id', function() {
      localStorage.setItem('currentID', this.get('id'));
    });
  },

  // Load ID from local storage
  loadLocal: function() {
    var id = localStorage.setItem('currentID');
    this.set('id', id);
  },

  // Reset local storage
  resetLocal: function() {
    localStorage.removeItem('currentID');
  }
});

var u = new User();
u.set('first_name', 'FIRST NAME');
u.set('last_name', 'LAST NAME');
console.log(u);
u.save();



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
