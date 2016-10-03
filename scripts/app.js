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

//Storing Player Selections in Document.Cookie
	var store_player_cookie = function(player_data, user_or_cpu){
		document.cookie = user_or_cpu+"="+player_data['name'];
		var player_names = document.cookie;
		console.log(player_names);
	}

/********************************
	HOME-TO-GAME TRANSITION
*********************************/

// Accessing Player Selections in Document.Cookie for User or CPU - Function
	var access_player_cookie = function(user_or_cpu) {
		var player;
		if (user_or_cpu === 'user') {
			player = document.cookie.split(';')[0].split('=')[1];
			return player;
		}
		else if (user_or_cpu === 'cpu') {
			player = document.cookie.split(';')[1].split('=')[1];
			return player;
		}
	}
};

$(document).ready(main)