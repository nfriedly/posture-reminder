var React = require('react');
var CounterUnit = require('./CounterUnit.jsx');

var Counter = React.createClass({


  getTime: function() {
    var totalSeconds = this.props.time;
    return {
      hours: Math.floor(totalSeconds/3600),
      minutes: Math.floor( (totalSeconds%3600)/60 ),
      seconds: Math.round( totalSeconds%60)
    };

  },

  handleHoursChange: function(newValue) {
    var diff = newValue - this.getTime().hours;
    this.onChange(this.props.time + diff * 3600);
  },

  handleMinutesChange: function(newValue) {
    var diff = newValue - this.getTime().minutes;
    this.onChange(this.props.time + diff * 60);
  },

  handleSecondsChange: function(newValue) {
    var diff = newValue - this.getTime().seconds;
    this.onChange(this.props.time + diff);
  },

  onChange: function(newValue) {
    this.props.onChange(newValue);
  },

  render: function() {
    var time = this.getTime();
    return (
      <spam className="counter">
        <CounterUnit value={time.hours} onChange={this.handleHoursChange} /> hours
        <CounterUnit value={time.minutes} onChange={this.handleMinutesChange} /> minutes
        <CounterUnit value={time.seconds} onChange={this.handleSecondsChange} /> seconds
      </spam>
    );
  }
});

module.exports = Counter;
