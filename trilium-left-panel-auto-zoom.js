// Version: 0.1
$(document).ready(function() {
	function showR() {
		window.sf = new Array();
		window.sf['model'] = 1 // Select the activation mode 
        /*  Three modes are supported :
 1. Automatically zoom in on the left panel when the mouse moves to the navigation bar. This is the default mode.
 2. Automatically zoom in on the left panel when the mouse moves to the left panel.
 3. Automatically zoom in on the left panel when the shortcut key `alt+s` is pressed. */
		window.sf['launcher'] = document.querySelectorAll("div#launcher-pane.component")[0];
		window.sf['left'] = document.querySelectorAll("div#left-pane.component")[0];
		window.sf['rest'] = document.querySelectorAll("div#rest-pane.component")[0];
		window.sf['inLeft'] = 199 // In Step 
		window.sf['inRest'] = 0 // Out To what step 
		window.sf['now'] = 0 // Odd number means it can be enlarged, and even number means it can be reduced 
		window.sf['speed'] = [0.4, 0.8, 1.2, 1.5, 1.9, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7, 3.9, 4.2, 4.4, 4.7, 4.9, 5.1, 5.4, 5.6, 5.8, 6.0, 6.2, 6.4, 6.6, 6.8, 6.9, 7.1, 7.3, 7.5, 7.6, 7.8, 8.0, 8.1, 8.3, 8.4, 8.6, 8.7, 8.9, 9.0, 9.2, 9.3, 9.4, 9.6, 9.7, 9.8, 10.0, 10.1, 10.2, 10.3, 10.4, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1, 11.2, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.8, 13.9, 14.0, 14.1, 14.1, 14.2, 14.3, 14.4, 14.4, 14.5, 14.6, 14.7, 14.7, 14.8, 14.9, 14.9, 15.0, 15.1, 15.2, 15.2, 15.3, 15.4, 15.4, 15.5, 15.5, 15.6, 15.7, 15.7, 15.8, 15.9, 15.9, 16.0, 16.0, 16.1, 16.2, 16.2, 16.3, 16.3, 16.4, 16.5, 16.5, 16.6, 16.6, 16.7, 16.7, 16.8, 16.9, 16.9, 17.0, 17.0, 17.1, 17.1, 17.2, 17.2, 17.3, 17.3, 17.4, 17.4, 17.5, 17.5, 17.6, 17.7, 17.7, 17.8, 17.8, 17.8, 17.9, 17.9, 18.0, 18.0, 18.1, 18.1, 18.2, 18.2, 18.3, 18.3, 18.4, 18.4, 18.5, 18.5, 18.6, 18.6, 18.6, 18.7, 18.7, 18.8, 18.8, 18.9, 18.9, 19.0, 19.0, 19.0, 19.1, 19.1, 19.2, 19.2, 19.2, 19.3, 19.3, 19.4, 19.4, 19.5, 19.5, 19.5, 19.6, 19.6, 19.7, 19.7, 19.7, 19.8, 19.8, 19.8, 19.9, 19.9, 20.0, 20.0];
		// Listen to mouse events. Only one mouse event and keyboard event can be enabled 
		switch (window.sf['model']) {
			case 1:
				{
					window.sf['launcher'].addEventListener("mouseover", inLeft);
					window.sf['rest'].addEventListener("mouseover", inRest);
					break;
				}
			case 2:
				{
					window.sf['left'].addEventListener("mouseover", inLeft);
					window.sf['rest'].addEventListener("mouseover", inRest);
					break;
				}
			case 3:
				{
					function suofang() {
						if (window.sf['now'] % 2 == 0) {
							inLeft();
						} else {
							inRest();
						}
					}
					api.bindGlobalShortcut("alt+s", suofang);
					break;
				}
			default:
		}
	}
	setTimeout(showR, 500);
});

function inLeft() {
	if (window.sf['now'] == 10001) {
		window.sf['now'] = 1;
	} else if (window.sf['now'] == 10000) {
		window.sf['now'] = 0;
	}
	if (window.sf['now'] % 2 == 1) {
		return;
	} else {
		window.sf['now'] += 1;
	}
	// Hide the paragraph edit button 
	var pb = document.getElementsByClassName("ck-button");
	if (typeof(pb) != "undefined") {
		var i;
		for (i = 0; i < pb.length; i++) {
			pb[i].style.display = "none";
		}
	}

	if (window.sf['inRest'] == 0 || window.sf['inRest'] == 1) //0
	{
		// The original width is obtained only when it is fully returned 
		window.sf['leftw'] = window.sf['left'].style.width;
		window.sf['restw'] = window.sf['rest'].style.width;
		window.sf['old_left'] = parseInt(window.sf['leftw'].substring(5, 7));
		window.sf['old_rest'] = parseInt(window.sf['restw'].substring(5, 7));
		if (window.sf['leftw'].charAt(7) != "%") {
			if (parseInt(window.sf['leftw'].charAt(7)) < 5) {
				window.sf['old_rest'] += 1;
			} else {
				window.sf['old_left'] += 1;
			}
		}
		window.sf['left'].style.setProperty('width', "calc(" + window.sf['old_left'] + "% - 2.5px)");
		window.sf['rest'].style.setProperty('width', "calc(" + window.sf['old_rest'] + "% - 2.5px)");
		window.sf['leftw'] = window.sf['left'].style.width;
		window.sf['restw'] = window.sf['rest'].style.width;
		//console.log(window.sf['old_left']);
	}
	var benci = window.sf['now'];
	for (var i = window.sf['inRest']; i < 200; i += 2) {
		(function(i) {
			setTimeout(function() {
				if (window.sf['now'] == benci) {
					// 1 or 2 indicates whether the method or reduction is in progress. Only one thing can be done 
					window.sf['left'].style.setProperty('width', window.sf['leftw'].replace(window.sf['old_left'],
						window.sf['old_left'] + window.sf['speed'][i]));
					window.sf['rest'].style.setProperty('width', window.sf['restw'].replace(window.sf['old_rest'],
						100 - (window.sf['old_left'] + window.sf['speed'][i])));
					window.sf['inLeft'] = i;
					// What is the current step 
				}
			}, (i + 1));
		})(i)
	}
}

function inRest() {
	if (window.sf['now'] % 2 == 0) {
		return;
	} else {
		window.sf['now'] += 1;
	}
	var benci = window.sf['now'];
	for (var i = 0; i < window.sf['inLeft'] + 1; i += 2) {
		(function(i) {
			setTimeout(function() {
				if (window.sf['now'] == benci) {
					window.sf['left'].style.setProperty('width', window.sf['leftw'].replace(window.sf['old_left'],
						window.sf['old_left'] + window.sf['speed'][window.sf['inLeft']] - window.sf['speed'][i]));
					window.sf['rest'].style.setProperty('width', window.sf['restw'].replace(window.sf['old_rest'],
						100 - (window.sf['old_left'] + window.sf['speed'][window.sf['inLeft']] - window.sf['speed'][i])));
					window.sf['inRest'] = 199 - i;
				}
			}, (i + 1));
		})(i)
	}
}