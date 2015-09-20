
/**
 * Main JS
 */

// Get user container.  Will attempt to see if stored in local storage.
var user = new User();

// Shows that you like.
// TODO: these come from somewhere else
var shows = [
    { id: 1, like: false, name: 'This American Life' },
    { id: 2, like: false, name: 'Reply All' },
    { id: 3, like: false, name: '99% Invisible' },
    { id: 4, like: false, name: 'Radiolab' },
    { id: 5, like: false, name: 'Morning Edition' },
    { id: 6, like: false, name: 'Fresh Air' },
    { id: 7, like: false, name: 'Star Talk' },
    { id: 8, like: false, name: 'On the Media' }
];

// Main template
var ractive = new Ractive({
  makeCards: function() {
    var cards=[];

    var loadCheck = function(){
      console.log("checking")
      cards = document.querySelectorAll('.stack li')
      var files = []

      if(cards.length < files.length ){
        setTimeout(loadCheck, 200)
      }
      else{
        cards = [].slice.call(document.querySelectorAll('ul li'))

        var stack = gajus.Swing.Stack();

        cards.forEach(function(targetElement,index) {
          stack.createCard(targetElement);
          files[cards.length - index - 1] = ($(cards[index]).attr("audiourl"))
        });



        var suggestions = [];

        for (var i=0; i < files.length; i++) {
          var sound = new Howl({
            urls:[files[i]]
          });
          suggestions.push(sound);
        }
        var current = 0;
        suggestions[current].play();
        // $('.find').on('click', function() {
        //   console.log('here');
        //
        // });

        stack.on('throwout', function(e) {
          var index = cards.indexOf(e.target);
          var card = cards.splice(index)[0];

          $(card).fadeOut(100, function() {
            $(card).remove();
          });
          suggestions[current].unload()
          current +=1;
          if(current< suggestions.length){
            suggestions[current].play()
          }
          // suggestions[current].unload();
          // current++;
          // if (current < suggestions.length) {
          //   suggestions[current].play();
          // }
        });
      }
    }
    setTimeout(loadCheck, 200);

  },
  el: '#container',
  template: '#template',
  data: {
        user: user,
        shows: shows,
    state: 'intro',
        _: _
  },
    adapt: [ Ractive.adaptors.Backbone ]
});

// Change state
ractive.on('setState', function(event, state) {
    this.set('state', state);
});

// When state changes
ractive.observe('state', function(newValue, old, key) {
    console.log(newValue);
    if (newValue && newValue !== old) {
        // Make new user when we move away from intro
        if (old === 'intro' && !user.id) {
            // TODO: Get name from user
            user.first_name = 'FNAME';
            user.last_name = 'LNAME';
            user.saveFetch();
        }
        if (newValue === 'suggest') {
            setTimeout(function(){
              this.makeCards();
            }.bind(this),2000)

        }
    }
});

// Check when fetch, this should happen once
ractive.observe('user.fetched', function(newValue, old, key) {
    var u = this.get('user');
    var e = u.get('episodes');
    var s = u.get('suggestions');

    if (newValue === true && newValue !== old) {
        // If there are episodes, list those
        if (u && e && e.length) {
            this.set('state', 'list');
        }
        // If not episodes (and not picking), suggest
        else if (this.get('state') !== 'pick') {
            this.set('state', 'suggest');
        }
    }
});

// Reset user save locally
ractive.on('resetLocal', function(event) {
    user.resetLocal();
});

// Select show from list of favorites
ractive.on('selectShow', function(event, id) {
    var shows = this.get('shows');
    var s = _.findWhere(shows, { id: id });

    if (s) {
        s.like = true;
        this.set('shows', shows);
    }
});

// Process a swipe suggestion
ractive.on('processSuggestion', function(event) {
    var user = this.get('user');
    var c = this.get('user.currentSuggestion');

    // Swipe right (good)
    if (event.original.direction == 4) {
     this.push('user.episodes', c);
     user.saveEpisode(c);
    }
    // Swipe left (bad)
    else if (event.original.direction == 2) {
     this.push('user.rejections', c);
     user.saveRejection(c);
    }
    // Bad swipe
    else {
     return;
    }

    // Get a new one, if no more, show list
    if (!user.getNewSuggestion()) {
     this.set('state', 'list');
    }
});
