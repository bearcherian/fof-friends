React = require('react');
LazyLoad = require('react-lazy-load');

module.exports = React.createClass({
	componentWillMount: function(){

		var profile = this.props.profile;
		var friend = this.isFriend();

		this.setState({
			"id": profile.id,
			"imageUrl" : profile.imageUrl,
			"xboxGamerTag" : profile.xboxGamerTag,
			"xboxProfile" : "https://account.xbox.com/en-us/profile?gamerTag=" + profile.xboxGamerTag,
			"username" : profile.userName,
			"friend" : friend
		});
	},
	lazyLoad: function() {
		this.refs.profileIcon.lazyLoadHandler();
	},
	handleAddClick: function(event) {
		
		if (!this.supports_html5_storage()) {
	        return false;
	    }

	    var friend;

	    var storageId = "did-" + this.state.id;
	    if (this.state.friend == false) {
	        localStorage[storageId] = true;
	        friend = true;
	    } else {
	        localStorage.removeItem(storageId);
	        friend = false;
	    }

	    this.setState({ "friend" : friend });

	    console.log(localStorage);
	},
	isFriend: function() {
		if (this.supports_html5_storage()) {
			return localStorage["did-" + this.props.profile.id] == "true";
		} else {
			return false;
		}
	},
	supports_html5_storage: function() {
	    try {
	        return 'localStorage' in window && window['localStorage'] !== null;
	    } catch (e) {
	        return false;
	    }
	},
	render: function(){
		console.log("-- loading Friend...");
		var profile = this.props.profile;
		console.log(profile);
		var glyphiconClass = "glyphicon-plus";
		var friendClass = "";
		var buttonClass = "btn-success";

		if (this.state.friend == true) {
			glyphiconClass = "glyphicon-minus";
			friendClass = "friended";
			buttonClass = "btn-danger";
		}

		return(
			<div className={friendClass + ' list-group-item friend'}>
				<div className="media">
					<div className="media-left">
						<a onClick={this.handleAddClick} target="_blank" href={'https://account.xbox.com/en-us/profile?gamerTag=' + profile.xboxGamerTag}>
							<LazyLoad height={48} width={48} ref={'profileIcon'}>
								<img src={profile.imageUrl}/>
							</LazyLoad>	
						</a>
					</div>
					<div className="media-body">
						<h3 className="media-heading">
							<a onClick={this.handleAddClick} target="_blank" href={'https://account.xbox.com/en-us/profile?gamerTag=' + profile.xboxGamerTag}>
								{profile.xboxGamerTag} <small><em>@{this.state.username}</em></small>
							</a>
						</h3>
					</div>
					<div className="media-right">
						<button onClick={this.handleAddClick} className={buttonClass + ' btn actionButton btn-lg'}>
							<i className={'glyphicon ' + glyphiconClass}></i>
						</button>
					</div>
				</div>
			</div>
			)
	}
})