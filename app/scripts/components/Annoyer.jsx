var React = require('react');
var Reflux = require('reflux');

var Counter = require('./Counter.jsx');
var TimerStore = require('../stores/TimerStore.js');
var TimerActions = require('../actions/TimerActions.js');

var GOOD_MULTIPLIER = 1.6;
var BAD_MULTPLIER = 0.6;

var GOOD = 'good';
var OK = 'ok';
var BAD = 'bad';

var CAN_NOTIFY = ("Notification" in window);

var Annoyer = React.createClass({

  // this will cause setState({timer: timerState}) whenever the store does trigger(state)
  mixins: [Reflux.connect(TimerStore, "timer")],

  handleEnd: function() {
    console.log('end!');
    this.setState({asking: true});
    console.log(this.state);
    if (this.state.notificationPermission) {
      this.notification = new Notification("Posture check!", {
        body: "How's your posture?"
         // todo: add icon
      });
      this.notification.onerror = function(err) {
        console.error('notification error: ', err)
      };
    }
  },

  getInitialState: function() {
    // todo: put this in an initializer/constructor/etc
    TimerActions.end.listen(this.handleEnd);

    return {
      notificationPermission: CAN_NOTIFY && Notification.permission === 'granted',
      asking: true,
      lastAnswer: OK
    }
  },

  handleGoodPosture: function() {
    this.reset(GOOD, this.state.timer.length * GOOD_MULTIPLIER);
  },

  handleOkPosture: function() {
    this.reset(OK);
  },

  handleBadPosture: function() {
    this.reset(BAD, this.state.timer.length * BAD_MULTPLIER);
  },

  requestNotificationPermission: function() {
    Notification.requestPermission(this.handleNotificationPermission);
  },

  handleNotificationPermission: function (permission) {
    this.setState({notificationPermission: (permission === 'granted')})
  },

  reset: function(answer, newSeconds) {
    if (!this.state.notificationPermission) {
      this.requestNotificationPermission();
    }
    if (this.notification) {
      this.notification.close();
      this.notification = null;
    }
    this.setState({lastAnswer: answer, asking: false});
    TimerActions.reset(newSeconds);
    TimerActions.start();
  },

  handleTimeChange: function(seconds) {
    // when a user changes the time in the input, make it permanent by changing both
    // the time remaining in this countdown and the total time in future countdowns
    var diff = seconds - this.state.timer.timeRemaining;
    TimerActions.addTime(diff);
  },

  render: function() {
    var timer = this.state.timer;
    return (
      <form className="form-inline">
        <div className={"alert alert-warning " + ((CAN_NOTIFY && !this.state.notificationPermission) ? 'show' : 'hide')} role="alert">
          <i className="fa fa-warning"></i> This app needs Notification permission to work properly. &nbsp; <button className="btn btn-info" onClick={this.requestNotificationPermission}><i className="fa fa-toggle-on"/> Enable Notifications</button>
        </div>
        <div className={"alert alert-danger " + (CAN_NOTIFY ? 'hide' : 'show')} role="alert">
          <i className="fa fa-warning"></i> Your browser does not appear to support the Notification feature that this app needs to work properly.
        </div>
        <fieldset className={"ask " + (this.state.asking ? 'show' : 'hidden')}>
          <legend><i className="fa fa-question-circle"></i> How's your posture?</legend>
            <p><i>(Before you thought about it and straightened up ;)</i></p>
            <p>
              <button className="btn btn-danger btn-lg" onClick={this.handleBadPosture}><i className="fa fa-wheelchair"/> Bad</button>
              <button className="btn btn-primary btn-lg" onClick={this.handleOkPosture}><i className="fa fa-male"/> Ok</button>
              <button className="btn btn-success btn-lg" onClick={this.handleGoodPosture}><i className="fa fa-child"/> Good</button>
            </p>
        </fieldset>

        <fieldset className={"timer " + (this.state.asking ? 'hidden' : 'show')}>
          <legend><i className="fa fa-clock-o"></i> Keep it straight!</legend>
          <p>Next annoyance in <Counter time={timer.timeRemaining} onChange={this.handleTimeChange} /> &nbsp; <button onClick={TimerActions.toggle} className="btn btn-primary">{timer.ticking ? 'Stop' : 'Go'}</button></p>
        </fieldset>

      </form>
    )
  }


});

module.exports = Annoyer;
