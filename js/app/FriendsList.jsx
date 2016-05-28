React = require('react');
FriendSection = require('./FriendsSection.jsx');

module.exports = React.createClass({
	getInitialState: function(){
		return { friendsData : null }
	},
	componentDidMount: function(){
		console.log("Getting " + this.props.source);
		this.serverRequest = $.get(this.props.source, function(data){
			this.setState({friendsData : data});
		}.bind(this));
	},
	componentWillUnmount: function(){
		this.serverRequest.abort();
	},
	render: function(){
		console.log("Rendering Friend List...");
		var friendSections = [];
		if (this.state.friendsData != null) {
			// console.log(this.state.friendsData);
			for (var key in this.state.friendsData) {
				console.log("Adding section  " + key);
				friendSections.push(<FriendSection key={key} anchor={key} profiles={this.state.friendsData[key]} />);
			}		
		}
		
		return(
			<div>
				{friendSections}
			</div>
			);
	}
});