var Reflux = require('reflux');
var TimerActions = require('../actions/TimerActions.js');
var Immutable = require('immutable');

var TimerStore = Reflux.createStore({

  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [TimerActions],

  init: function() {
    console.log('TimerStore initialized');
    // todo: consider loading state from localStorage
    this.state = Immutable.Map({
      length: 10 * 60, /* 10 minutes, in seconds */
      timeRemaining: 10 * 60,
      ticking: false
    });
  },

  onSetTimeRemaining: function(seconds) {
    this.setState({
      timeRemaining: Math.round(seconds)
    });
  },

  onSetLength: function(seconds) {
    this.setState({
      length: Math.round(seconds)
    })
  },

  onAddTime: function(seconds) {
    this.setState({
      length: Math.round(this.state.get('length') + seconds),
      timeRemaining: Math.round(this.state.get('timeRemaining') + seconds)
    });
  },

  tick: function() {
    if (!this.state.get('ticking')) {
      return;
    }
    var newTimeRemaining = this.state.get('timeRemaining') - 1;
    TimerActions.setTimeRemaining(newTimeRemaining);
    console.log('tick - new time remaining', newTimeRemaining);
    if (newTimeRemaining <= 0) {
      TimerActions.end();
    }
  },

  start: function() {
    this.interval = setInterval(this.tick.bind(this), 1000); // todo: compensate for processing time by calculating time since last tick and subtracting it (as long as it's under 1000)
    this.setState({ticking:true});
  },

  stop: function() {
    clearInterval(this.interval);
    this.setState({ticking: false})
  },

  toggle: function() {
    if (this.state.get('ticking')) {
      TimerActions.stop();
    } else {
      TimerActions.start();
    }
  },

  onEnd: function() {
    console.log('store.end')
    TimerActions.stop();
  },

  onReset: function(seconds) {
    seconds = (typeof seconds == "number") ? Math.round(seconds) : this.state.get('length');
    this.setState({
      length: seconds,
      timeRemaining: seconds
    });
  },

  setState: function(state) {
    console.log('updating state', state);
    this.state = this.state.merge(state);
    this.trigger(this.state.toJS());
  },

  getInitialState: function() {
    return this.state.toJS();
  }

});

module.exports = TimerStore;


// todo: consider setting time in
