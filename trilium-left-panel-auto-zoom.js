// version: 0.2.2
var sf = new Array();
$(document).ready(function () {
	function showR() {
		sf['model'] = 1; // Select the activation mode 
		/*  Three modes are supported :
		1. Automatically zoom in on the left panel when the mouse moves to the navigation bar. This is the default mode.
		2. Automatically zoom in on the left panel when the mouse moves to the left panel.
		3. Automatically zoom in on the left panel when the shortcut key `alt+s` is pressed. */
		sf['scale'] = 20; //Default zoom 20% 
		sf['key'] = "alt+x"; //Only run when the mode = 3
		sf['delay'] = 150 //The event that the mouse needs to stay when the mouse moves in, default:100ms

		sf['launcher'] = document.querySelectorAll("div#launcher-container.component")[0];
		sf['left'] = document.querySelectorAll("div#left-pane.component")[0];
		sf['rest'] = document.querySelectorAll("div#rest-pane.component")[0];
		sf['bx-chevrons'] = document.querySelectorAll("div#launcher-pane.component > button.button-widget.bx.component.launcher-button")[0];
		sf['left_display'] = 1; //1: flex   0: none
		sf['mmx'] = 0;
		if (sf['left'].style.display == "none") {
			sf['left_display'] = 0;
		}

		function change_left_display() {
			sf['left_display'] = (sf['left_display'] + 1) % 2;
		}
		sf['bx-chevrons'].addEventListener("mouseover", function () {
			sf['bx-chevrons'].addEventListener("click", change_left_display);
		});
		sf['bx-chevrons'].addEventListener("mouseout", function () {
			sf['bx-chevrons'].removeEventListener("click", change_left_display);
		});

		sf['inLeft'] = 199 // In Step 
		sf['inRest'] = 0 // Out step 
		sf['now'] = 0 // Odd number means it can be enlarged, and even number means it can be reduced 
		sf['speed'] = []
		for (var i = 0; i < 200; i++) {
			sf['speed'].push(parseFloat((-sf['scale'] / 40000 * (i - 200) * (i - 200) + sf['scale'])
				.toFixed(1)));
		}

		// Listen to mouse events. Only one mouse event and keyboard event can be enabled 
		switch (sf['model']) {
			case 1:
				{
					var timeoutEnter;
					$(sf['launcher']).mouseenter(function () {
						clearTimeout(timeoutEnter);
						timeoutEnter = setTimeout(function () {
							inLeft();
						}, sf['delay']);
					}).mouseleave(function () {
                        clearTimeout(timeoutEnter); 
                    });

					sf['rest'].addEventListener("mouseover", inRest);
					sf['bx-chevrons'].addEventListener("mouseover", inRest);
					break;
				}
			case 2:
				{
                    var timeoutEnter;
					$(sf['left']).mouseenter(function () {
						clearTimeout(timeoutEnter);
						timeoutEnter = setTimeout(function () {
							inLeft();
						}, sf['delay']);
					}).mouseleave(function () {
                        clearTimeout(timeoutEnter); 
                    });
                    			/*		var timeoutEnter;
					$(sf['launcher']).mouseenter(function () {
						clearTimeout(timeoutEnter);
						timeoutEnter = setTimeout(function () {
							inLeft();
						}, sf['delay']);
					})
					*/
					sf['rest'].addEventListener("mouseover", inRest);
					sf['bx-chevrons'].addEventListener("mouseover", inRest);
					break;
				}
			case 3:
				{
					function suofang() {
						if (sf['now'] % 2 == 0) {
							inLeft();
						} else {
							inRest();
						}
					}
					api.bindGlobalShortcut(sf['key'], suofang);
					break;
				}
			default:
				{
					sf['launcher'].addEventListener("mouseover", inLeft);
					sf['rest'].addEventListener("mouseover", inRest);
					sf['bx-chevrons'].addEventListener("mouseover", inRest);
				}
		}
	}
	setTimeout(showR, 500);
});

function inLeft() {
	if (sf['now'] == 10001) {
		sf['now'] = 1;
	} else if (sf['now'] == 10000) {
		sf['now'] = 0;
	}
	if (sf['now'] % 2 == 1) {
		return;
	} else {
		sf['now'] += 1;
	}

	if (sf['left_display'] == 0) {
		sf['bx-chevrons'].click();
		return;
	}

	// Hide the paragraph edit button 
	var pb = document.getElementsByClassName("ck-button");
	if (typeof (pb) != "undefined") {
		var i;
		for (i = 0; i < pb.length; i++) {
			pb[i].style.display = "none";
		}
	}

	if (sf['inRest'] == 0 || sf['inRest'] == 1) //0
	{
		// The original width is obtained only when it is fully returned 
		sf['leftw'] = sf['left'].style.width;
		sf['restw'] = sf['rest'].style.width;
		sf['old_left'] = parseInt(sf['leftw'].substring(5, 7));
		sf['old_rest'] = parseInt(sf['restw'].substring(5, 7));
		if (sf['leftw'].charAt(7) != "%") {
			if (parseInt(sf['leftw'].charAt(7)) < 5) {
				sf['old_rest'] += 1;
			} else {
				sf['old_left'] += 1;
			}
		}
		sf['left'].style.setProperty('width', "calc(" + sf['old_left'] + "% - 2.5px)");
		sf['rest'].style.setProperty('width', "calc(" + sf['old_rest'] + "% - 2.5px)");
		sf['leftw'] = sf['left'].style.width;
		sf['restw'] = sf['rest'].style.width;
	}
	var benci = sf['now'];
	for (var i = sf['inRest']; i < 200; i += 1) {
		(function (i) {
			setTimeout(function () {
				if (sf['now'] == benci) {
					// 1 or 2 indicates whether the method or reduction is in progress. Only one thing can be done 
					sf['left'].style.setProperty('width', sf['leftw'].replace(sf['old_left'],
						sf['old_left'] + sf['speed'][i]));
					sf['rest'].style.setProperty('width', sf['restw'].replace(sf['old_rest'],
						100 - (sf['old_left'] + sf['speed'][i])));
					sf['inLeft'] = i;
					// What is the current step 
				}
			}, (i + 1));
		})(i)
	}
}

function inRest() {
	if (sf['now'] % 2 == 0) {
		return;
	} else {
		sf['now'] += 1;
	}
	if (sf['left_display'] == 0) {
		sf['bx-chevrons'].click();
		sf['left_display'] = 0;
		return
	}
	// show the paragraph edit button 
	setTimeout(function () {
		var pb = document.getElementsByClassName("ck-button");
		if (typeof (pb) != "undefined") {
			var i;
			for (i = 0; i < pb.length; i++) {
				pb[i].style.display = "inline-flex";
			}

		}
	}, 100);

	var benci = sf['now'];
	for (var i = 0; i < sf['inLeft'] + 1; i += 1) {
		(function (i) {
			setTimeout(function () {
				if (sf['now'] == benci) {
					sf['left'].style.setProperty('width', sf['leftw'].replace(sf['old_left'],
						sf['old_left'] + sf['speed'][sf['inLeft']] - sf['speed'][i]));
					sf['rest'].style.setProperty('width', sf['restw'].replace(sf['old_rest'],
						100 - (sf['old_left'] + sf['speed'][sf['inLeft']] - sf['speed'][i])));
					sf['inRest'] = 199 - i;
				}
			}, (i + 1));
		})(i)
	}
}