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
		var text = data.toString();
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
		GAME VARIABLES
*********************************/

var user_pts = 0;
var cpu_pts = 0;
var user_shot_pct; //User Shot Percentage
var cpu_shot_pct; //CPU Shot Percentage
var cpu_shot_a_prob; //Likelihood that CPU chooses Midrange Jumper
var cpu_shot_b_prob; //Likelihood that CPU chooses Three Pointer
var user_shots = 0;
var cpu_shots = 0;
var user_makes = 0;
var user_misses = 0;
var cpu_makes = 0;
var cpu_misses = 0;
var user_3p_makes = 0;
var cpu_3p_makes = 0;
var user_3p_shots = 0;
var cpu_3p_shots = 0;
var wins = 0;
var user_winstreak = 0;
var cpu_winstreak = 0;

/********************************
		GAME SIMULATION
*********************************/

//Load User Stat Data - Function
	var load_user_data = function() {
		var user_player = access_player_cookie('user');
		var user_data = parse_json(user_player, json_data);
		var shot_a_pct = user_data['shot_a_pct'];
		var shot_b_pct = user_data['shot_b_pct'];
		return [shot_a_pct, shot_b_pct];
	}

//Load CPU Stat Data - Function
	var load_cpu_data = function() {
		var cpu_player = access_player_cookie('cpu');
		var cpu_data = parse_json(cpu_player, json_data);
		var shot_a_pct = cpu_data['shot_a_pct'];
		var shot_b_pct = cpu_data['shot_b_pct'];
		var shot_a_likelihood = cpu_data['shot_a_likelihood'];
		var shot_b_likelihood = cpu_data['shot_b_likelihood'];
		return [shot_a_pct, shot_b_pct, shot_a_likelihood, shot_b_likelihood];
	}

//CPU Shot Decision - Function (This determines what kind of shot the CPU will take)
	var shot_cpu_decide = function(cpu_shot_a_likelihood, cpu_shot_b_likelihood) {
		var cpu_shot = Math.floor(Math.random()*(100-1+1)+1);
		if (cpu_shot <= cpu_shot_a_likelihood*100) {
			return "Midrange Jumper";
		}
		else if ((cpu_shot > cpu_shot_a_likelihood*100) && (cpu_shot <= cpu_shot_a_likelihood*100 + cpu_shot_b_likelihood*100)) {
			return "Three Pointer";
		}
	}

//Shot Process Button - Function (This will change the function variables for shot_value/shot_probability)
	var shot_process = function(button, shot_type, shot_a_pct, shot_b_pct) {
		if ($(button).hasClass('shot_a')) { //The extra dollar sign is to convert it into a jQuery object
			var shot_value = 2;
			var shot_pct = shot_a_pct;
		}
		else if ($(button).hasClass('shot_b')) { //The extra dollar sign is to convert it into a jQuery object
			var shot_value = 3;
			var shot_pct = shot_b_pct;
		}
		else if (shot_type === "Midrange Jumper") {
			var shot_value = 2;
			var shot_pct = shot_a_pct;
		}
		else if (shot_type === "Three Pointer") {
			var shot_value = 3;
			var shot_pct = shot_b_pct;
		}
		return [shot_value, shot_pct];
	}

//Shot Simulation - Function (This returns a shot instance)
	var shot_simulate = function(){
		return Math.floor(Math.random()*(100-1+1)+1);
	}

//Shot Evaluation - Function (This takes the shot instance value and evaluates it as a success or a failure)
	var shot_evaluate = function(shots, makes, pts, three_pt_shots, three_pt_makes, simulated_shot, shot_value, shot_pct) {
		var shots = shots;
		var makes = makes;
		var pts = pts;
		var three_pt_shots = three_pt_shots;
		var three_pt_makes = three_pt_makes;
		shots += 1;
		if (simulated_shot <= shot_pct*100) { //Successful Shot
			pts += shot_value;
			makes += 1;
			if (shot_value === 3) {
				three_pt_makes += 1;
				three_pt_shots += 1;
			}
		else { //Failed Shot
			if (shot_value === 3) {
				three_pt_shots += 1;
			}
		}
		}
		return [shots, makes, pts, three_pt_shots, three_pt_makes];
	}

//User Shot Outcome - Function (Calls the other functions relevant to starting and evaluating the shots)
	var user_shot_outcome = function(button) {
		var user_data = load_user_data();
		var shot_value = shot_process(button, 'n/a', user_data[0], user_data[1])[0];
		var shot_pct = shot_process(button, 'n/a', user_data[0], user_data[1])[1];
		simulated_shot = shot_simulate();
		var outcome = shot_evaluate(user_shots, user_makes, user_pts, user_3p_shots, user_3p_makes, simulated_shot, shot_value, shot_pct);
		user_shots = outcome[0];
		user_makes = outcome[1];
		user_pts = outcome[2];
		user_3p_shots = outcome[3];
		user_3p_makes = outcome[4];
		mod_html(user_pts, 'user_pts');
		mod_html(user_makes, 'user_makes');
		mod_html(user_shots, 'user_shots');
		mod_html(((user_makes/user_shots).toFixed(2)*100).toFixed(0)+'%', 'user_shot_pct');
		mod_html(((user_3p_makes/user_3p_shots).toFixed(2)*100).toFixed(0)+'%', 'user_3p_shot_pct');
	}

//CPU Simulation Initiation - Function 
	var cpu_shot_outcome = function() {
		var cpu_data = load_cpu_data();
		var cpu_shot = shot_cpu_decide(cpu_data[2], cpu_data[3]);
		var shot_value = shot_process(null, cpu_shot, cpu_data[0], cpu_data[1])[0];
		var shot_pct = shot_process(null, cpu_shot, cpu_data[0], cpu_data[1])[1];
		simulated_shot = shot_simulate();
		var outcome = shot_evaluate(cpu_shots, cpu_makes, cpu_pts, cpu_3p_shots, cpu_3p_makes, simulated_shot, shot_value, shot_pct);
		cpu_shots = outcome[0];
		cpu_makes = outcome[1];
		cpu_pts = outcome[2];
		cpu_3p_shots = outcome[3];
		cpu_3p_makes = outcome[4];
		mod_html(cpu_pts, 'cpu_pts');
		mod_html(cpu_makes, 'cpu_makes');
		mod_html(cpu_shots, 'cpu_shots');
		mod_html(((cpu_makes/user_shots).toFixed(2)*100).toFixed(0)+'%', 'cpu_shot_pct');
		mod_html(((cpu_3p_makes/cpu_3p_shots).toFixed(2)*100).toFixed(0)+'%', 'cpu_3p_shot_pct');
	}

//Shot Simulation Initiation - Function (Binded to the Shot Buttons)
	$('.shot_type').click(function(){
		var button = this;
		user_shot_outcome(button);
		cpu_shot_outcome();
	});

};

$(document).ready(main)