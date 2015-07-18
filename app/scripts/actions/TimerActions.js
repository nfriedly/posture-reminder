Reflux = require('reflux');

module.exports = TimerActions = Reflux.createActions([
  'start',
  'stop',
  'toggle',
  'tick', // fired by the timer
  'end', // fired by the timer
  'setTimeRemaining',
  'setLength',
  'addTime', // updates both the time remaining and the length in a single event. value may be negative
  'reset' // accepts an optional value of new timer length. sets time remaining to either this value or the existing timer length
]);
