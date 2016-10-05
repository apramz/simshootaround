var main = function(){
/********************************
*********************************
			HOME
*********************************
*********************************/
//AJAX Call to Load JSON Data
jQuery.extend({
	getValues: function(){
		var result = null;
		$.ajax({ 
		    type: "GET", 
		    url: "data/players.json", 
		    data: { get_param: 'value' }, 
		    dataType: 'json',
		    async: false,
		    success: function (data) {
		            result = data;
		    	}
		});
		return result;
	}
});
var json_data = $.getValues();

/********************************
			TOOLBOX
*********************************/
//Clears Content of Selected Area - Function
	var clear = function(content_area) {
		$('#'+content_area).empty();
	}

//Modifies HTML of Destination Area with Data - Function 
	var mod_html = function(data, destination_id){
		text = data.toString();
		clear(destination_id);
		$('#'+destination_id).append(text);
	};

//Modifies Image Link of Destination Area - Function
	var mod_html_img = function(img_src, destination_id){
		var img = document.createElement('img');
		img.src= img_src;
		clear(destination_id);
		$('#'+destination_id).append(img);
	}

/********************************
		PLAYER SELECTION
*********************************/

//Click Menu Option to Select Player Name - Function
	var select_player = function(e) {
		var player_key = $(e).attr("player-id");
		return player_key;
	};

//Parse the JSON File to Get Player Data - Function 
	var parse_json = function(player_key, json_data){
    	$.each(json_data, function(key, value) {
            if (key === player_key) {
            	player_data = value;
            }
        });
		return player_data;
	};

//Modify User HTML with JSON Data - Function (Calls mod_html for each part of the user info display)
	var update_user_stats = function(player_data){
		mod_html(player_data['name'], 'userNameHomeDisplay');
		mod_html(player_data['season'], 'userSeasonHomeDisplay');
		mod_html(player_data['context'], 'userContextHomeDisplay');
		mod_html(player_data['shot_a_pct']+"%", 'userShotAPctHomeDisplay');
		mod_html(player_data['shot_b_pct']+"%", 'userShotBPctHomeDisplay');
		mod_html_img(player_data['image'], 'userImageHomeDisplay');
		store_player_cookie(player_data, 'user');
	}

//Modify CPU HTML with JSON Data - Function (Calls mod_html for each part of the cpu info display)
	var update_cpu_stats = function(player_data){
		mod_html(player_data['name'], 'cpuNameHomeDisplay');
		mod_html(player_data['season'], 'cpuSeasonHomeDisplay');
		mod_html(player_data['context'], 'cpuContextHomeDisplay');
		mod_html(player_data['shot_a_pct']+"%", 'cpuShotAPctHomeDisplay');
		mod_html(player_data['shot_b_pct']+"%", 'cpuShotBPctHomeDisplay');
		mod_html_img(player_data['image'], 'cpuImageHomeDisplay');
		store_player_cookie(player_data, 'cpu');
	}

//Post-Selection Modify User Display Function (Binded to the List Items for Users)
	$('.player.user').click(function(){
		var player = this;
		player_key = select_player(player);
		player_data = parse_json(player_key, json_data);
		update_user_stats(player_data);
	});

//Post-Selection Modify Cpu Display Function (Binded to the List Items for Cpu)
	$('.player.cpu').click(function(){
		var player = this;
		player_key = select_player(player);
		player_data = parse_json(player_key, json_data);
		update_cpu_stats(player_data);
	});

/********************************
		COOKIE FUNCTIONS
*********************************/

//Storing Player Selections in Document.Cookie
	var store_player_cookie = function(player_data, user_or_cpu){
		document.cookie = user_or_cpu+"="+player_data['name'];
		var player_names = document.cookie;
		console.log(player_names);
	}

//Accessing Player Selections in Document.Cookie for User or CPU - Function
	var access_player_cookie = function(user_or_cpu) {
		var player;
		var player1 = document.cookie.split(';')[0]; //Splits the cookie into the two entries, this one is selecting the first
		var player2 = document.cookie.split(';')[1]; //Splits the cookie into the second entry
		if (user_or_cpu === 'user') {
			if (player1.indexOf('user') >= 0) { //Checks if first entry contains the 'user' keyword
				player = player1.split('=')[1]; //Splits the 'user' keyword from the player name
				return player;
			}
			else {
				player = player2.split('=')[1];
				return player;
			}
		}
		else if (user_or_cpu === 'cpu') {
			if (player1.indexOf('cpu') >= 0) { //Checks if first entry contains the 'cpu' keyword
				player = player1.split('=')[1]; //Splits the 'cpu' keyword from the player name
				return player;
			}
			else {
				player = player2.split('=')[1];
				return player;
			}
		}
	}

//Clearing Player Selections in Document.Cookie for User + CPU - Function 
	var clear_player_cookie = function() {
		document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		document.cookie = "cpu=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	}

/********************************
*********************************
			GAME
*********************************
*********************************/

/********************************
		PLAYER CARD UPDATES
*********************************/

//Modify User Player Card Data - Function
	var update_user_card = function() {
		var user_player = access_player_cookie('user');
		var user_data = parse_json(user_player, json_data);
		mod_html(user_data['name'], 'userNameGameDisplay');
		mod_html_img(user_data['image'], 'userImageGameDisplay');
	}

// Modify CPU Player Card Data - Function
	var update_cpu_card = function() {
		var cpu_player = access_player_cookie('cpu');
		var cpu_data = parse_json(cpu_player, json_data);
		mod_html(cpu_data['name'], 'cpuNameGameDisplay');
		mod_html_img(cpu_data['image'], 'cpuImageGameDisplay');
	}

//Initial Loading of Player Info - Function
	window.onload = function() {
		update_user_card();
		update_cpu_card();
	}

/********************************
		GAME SIMULATION
*********************************/

 
};

$(document).ready(main)