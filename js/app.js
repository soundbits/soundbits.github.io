
/**
 * Main JS
 */

// Get user container.  Will attempt to see if stored in local storage.
var user = new User();

// Shows that you like.
// TODO: these come from somewhere else
var shows = [
    { id: 1, like: false, name: 'This American Life', url:"/imgs/TALLogo.png" },
    { id: 2, like: false, name: 'Reply All', url:"/imgs/ReplyAllLogo.jpg" },
    { id: 3, like: false, name: '99% Invisible', url:"/imgs/99InvisibleLogo.jpg" },
    { id: 4, like: false, name: 'Radiolab', url:"/imgs/RadiolabLogo.jpg" },
    { id: 5, like: false, name: 'Morning Edition', url:"/imgs/MorningEditionLogo.jpg" },
    { id: 6, like: false, name: 'Fresh Air', url:"/imgs/FreshAirLogo.png" },
    { id: 7, like: false, name: 'Star Talk', url:"/imgs/StarTalkLogo.jpg" },
    { id: 8, like: false, name: 'On the Media', url:"/imgs/OTMLogo.jpg" }
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

          var episodeId = parseInt($(e.target).attr("episodeId"))

          var s  =ractive.get("user").get("suggestions").filter(function(s){return s.id==episodeId})[0]
          processSuggestion(e, s)

        });

        stack.on('throwoutright', function(e) {
          console.log(ractive.get('selections'));
          ractive.set('selections', ractive.get('selections') + 1);
        });
      }
    }
    setTimeout(loadCheck, 200);

  },
  el: '#container',
  template: '#template',
  data: {
        selections: 0,
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
function processSuggestion(event, currentEpisode) {

    var user = ractive.get('user');
    console.log("current episode ", currentEpisode )
    // Swipe right (good)
    if (event.throwDirection == 1) {
     ractive.push('user.episodes', currentEpisode);
     user.saveEpisode(currentEpisode);
    }
    // Swipe left (bad)
    else if (event.throwDirection == 2) {
     ractive.push('user.rejections', currentEpisode);
     user.saveRejection(currentEpisode);
    }
    // Bad swipe
    else {
     return;
    }

    // Get a new one, if no more, show list
    // if (!user.getNewSuggestion()) {
    //  this.set('state', 'list');
    // }
}
