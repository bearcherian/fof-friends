var React = require('react');
var ReactDOM = require('react-dom');
var FriendsList = require('./FriendsList.jsx')

var FriendsApp = React.createClass({
	getInitialState: function(){
		return {
			"friendsUrl" : "friendslist.php"
		}
	},
	componentWillMount: function() {
		
	},
	render: function() {
		return (
			<FriendsList source={this.state.friendsUrl} />
			)
	}
});

jQuery(document).ready(function() {
	ReactDOM.render(<FriendsApp />, document.getElementById('friendsApp'));
})