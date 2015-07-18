var React = require('react');

var CounterUnit = React.createClass({
  onChange: function(e) {
    this.props.onChange(e.target.value);
  },
  render: function() {
    // todo: pull the css class out of here
    return (
      <input type="number" value={this.props.value} onChange={this.onChange} className="form-control" />
    );
  }
});

module.exports = CounterUnit;
