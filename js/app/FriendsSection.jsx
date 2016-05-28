/**
	Represents a section.grouping of friends
**/

React = require('react');
Friend = require('./Friend.jsx');

module.exports = React.createClass({
	lazyLoadCheck: function(event) {
		console.log(event);
	},
	handleAddButtonClick: function(event) {
		console.log(event);
	},
	componentDidMount: function(){

	},
	render: function(){
		
		console.log("Loading profiles for " + this.props.anchor + "...");
		var profiles = [];
		if (this.props.profiles != null) {
			for (var i=0;i<this.props.profiles.length;i++) {
				profiles.push(<Friend key={i} addClick={this.handleAddButtonClick} profile={this.props.profiles[i]} />);
			}
		}
		console.log("...done");

		console.log("Rendering : " + this.props.anchor);
		return(
			<div className="panel-group friend-section" role="tablist">
				<div className="panel">
					<a className="btn btn-link btn-sm collapsed" role="button" data-toggle="collapse" href={'#' + this.props.anchor + 'ListGroup'}><h2>{this.props.anchor}</h2></a>	
					<div id={this.props.anchor + 'ListGroup'} className="panel-collapse collapse" role="tabpanel">
						<div className="list-group">
							{profiles}
						</div>
					</div>
				</div>
			</div>
		)
	}
})