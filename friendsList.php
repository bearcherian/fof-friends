<?php

define( "SLACK_TOKEN", '' );
define( "SEEN_URL", 'http://127.0.0.1:8890/seen.json');
define( "CACHE_KEY", "fof-friend-wall-" . filemtime( realpath( __FILE__ ) ) );
header('Content-Type: application/json');

ob_start();

// setup Memcached
if ( empty( $_GET['debug'] ) ) {
	$mc = new Memcached;
	$mc->addServer("127.0.0.1", 11211);
	if ( $cache = unserialize( $mc->get( CACHE_KEY ) ) ) {
		header( 'X-Cached: true' );
		header( 'X-Cache-Key: ' . filemtime( realpath( __FILE__ ) ) );
		header( 'Etag: ' . md5( $cache->out ));
		header( 'Last-Modified: '.gmdate( 'D, d M Y H:i:s', $cache->when ) );
		echo $cache->out;
		return;
	}
}

//get last seen
$ch = curl_init();
curl_setopt( $ch, CURLOPT_URL, SEEN_URL );
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
$res = curl_exec( $ch );
$status = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
$seen = null;
if ( $status == 200 ) {
	$seen = json_decode( $res );
	if ( !$seen )
		$seen = null;
}

// get user list from Slack
$ch = curl_init();
curl_setopt( $ch, CURLOPT_URL, 'https://slack.com/api/users.list' );
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_POST, true );
curl_setopt( $ch, CURLOPT_POSTFIELDS, array( 'token' => SLACK_TOKEN ) );
$res = curl_exec( $ch );
$status = curl_getinfo( $ch, CURLINFO_HTTP_CODE );

if ( !$res )
	die( "Unable to get the user list from slack. Contact @demitriousk if the problem persists</body></html>" );

$data = json_decode( $res );

if ( !$data || empty( $data ) )
	die( "Unable to parse the user list from slack. Contact @demitriousk if the problem persists</body></html>" );

if ( !$data->ok )
	die( "Unable to parse the user list from slack. Contact @demitriousk if the problem persists</body></html>" );

if ( !empty( $_GET['debug'] ) ) {
	//echo '<pre>'.print_r( $data->members, true ).'</pre>';
}

// sort members by firstname
$members = $data->members;
usort($members, "cmpMembers");

$friendsJson = array();

$currentLetter = "";
// iterate and output members
foreach( $members as $idx => $member ) {
	// skip members not seen in the last 30 days
	if ( $seen && is_object( $seen ) ) {
	   if ( !property_exists( $seen, $member->id ) )
		   continue;
	   $seen->{$member->id}[10] = ' ';
	   $seen->{$member->id} = strtotime( substr( $seen->{$member->id}, 0, 19 ) );
	   if ( ( time() - ( 31 * 86400 ) ) > $seen->{$member->id} )
		   continue;
	}
	//skip bots, deleted members, empty first_names, and teambot
	if ( !empty( $member->is_bot ) )
		continue;
	if ( !empty( $member->deleted ) )
		continue;
	if (!property_exists($member->profile, "first_name") || empty($member->profile->first_name) )
		continue;
	if ( $member->id == "U053GJH59" ) // teambot
		continue;

	//build json object for friend
	$friendData = array(
		"id" => $member->id,
		"imageUrl" => $member->profile->image_48,
		"xboxGamerTag" => $member->profile->first_name,
		"userName" => $member->name
		);

	$firstLetter = strtoupper( substr($friendData["xboxGamerTag"], 0, 1) );

	if (array_key_exists($firstLetter, $friendsJson)) {
		array_push($friendsJson[$firstLetter], $friendData);
	} else {
		$friendsJson[$firstLetter] = array($friendData);
	}

}

// Start output buffer
ob_start();
header('Content-Type: application/json');
echo json_encode($friendsJson);

if ( empty( $_GET['debug'] ) ) {
	$when = time();
	$out = ob_get_contents();
	header( 'Last-Modified: '.gmdate( 'D, d M Y H:i:s', $when ) );
	header( 'X-Cached: false' );
	header( 'X-Cache-Key: ' . filemtime( realpath( __FILE__ ) ) );
	header( 'Etag: ' . md5( $out ));
	$mc->set( CACHE_KEY, serialize( (object)array( 'out' => $out, 'when' => $when ) ), $when + 300 );
    header('Etag: ' . md5( $out ));
}
// die($out);

function cmpMembers($a, $b) {
	$aString = property_exists($a->profile, "first_name") ? $a->profile->first_name : $a->name;
	$bString = property_exists($b->profile, "first_name") ? $b->profile->first_name : $b->name;
	return strcmp($aString, $bString);
}
?>
