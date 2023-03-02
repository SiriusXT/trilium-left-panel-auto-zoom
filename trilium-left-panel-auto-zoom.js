$(document).ready(function() {
    // version: 0.2
	function showR() {
		window.sf = new Array();
		window.sf['model'] = 1 // Select the activation mode 
        /*  Three modes are supported :
 1. Automatically zoom in on the left panel when the mouse moves to the navigation bar. This is the default mode.
 2. Automatically zoom in on the left panel when the mouse moves to the left panel.
 3. Automatically zoom in on the left panel when the shortcut key `alt+s` is pressed. */
		window.sf['scale']=20;  //Default zoom 20% 
        window.sf['key']="alt+s"; //Only run when the mode = 3
        
        window.sf['launcher'] = document.querySelectorAll("div#launcher-container.component")[0];
		window.sf['left'] = document.querySelectorAll("div#left-pane.component")[0];
		window.sf['rest'] = document.querySelectorAll("div#rest-pane.component")[0];
        window.sf['bx-chevrons'] = document.querySelectorAll("div#launcher-pane.component > button.button-widget.bx.component.launcher-button")[0];
        window.sf['left_display'] = 1;//1: flex   0: none
        if (window.sf['left'].style.display=="none") {
            window.sf['left_display']=0;
        }        
        function change_left_display(){
            window.sf['left_display']=(window.sf['left_display']+1)%2;
        }
        window.sf['bx-chevrons'].addEventListener("mouseover", function(){
             window.sf['bx-chevrons'].addEventListener("click",change_left_display);
            }
        );
        window.sf['bx-chevrons'].addEventListener("mouseout", function(){
             window.sf['bx-chevrons'].removeEventListener("click",change_left_display);
            }
        );
        
		window.sf['inLeft'] = 199 // In Step 
		window.sf['inRest'] = 0 // Out step 
		window.sf['now'] = 0 // Odd number means it can be enlarged, and even number means it can be reduced 
        window.sf['speed']=[]
        for(var i=0;i<200;i++){
		window.sf['speed'].push(parseFloat((-window.sf['scale']/40000*(i-200)*(i-200)+window.sf['scale']).toFixed(1)));            
        }
        
		// Listen to mouse events. Only one mouse event and keyboard event can be enabled 
		switch (window.sf['model']) {
			case 1:
				{
					window.sf['launcher'].addEventListener("mouseover", inLeft);
					window.sf['rest'].addEventListener("mouseover", inRest);
                    window.sf['bx-chevrons'].addEventListener("mouseover", inRest);
					break;
				}
			case 2:
				{
					window.sf['left'].addEventListener("mouseover", inLeft);
                    window.sf['launcher'].addEventListener("mouseover", inLeft);
					window.sf['rest'].addEventListener("mouseover", inRest);
                    window.sf['bx-chevrons'].addEventListener("mouseover", inRest);
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
					api.bindGlobalShortcut(window.sf['key'], suofang);
					break;
				}
			default:
                {
                    window.sf['launcher'].addEventListener("mouseover", inLeft);
					window.sf['rest'].addEventListener("mouseover", inRest);
                    window.sf['bx-chevrons'].addEventListener("mouseover", inRest);
                }
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
    
    if (window.sf['left_display']==0){
        window.sf['bx-chevrons'].click();
        return;
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
	}
	var benci = window.sf['now'];
	for (var i = window.sf['inRest']; i < 200; i += 1) {
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
    if (window.sf['left_display']==0){
        window.sf['bx-chevrons'].click();
        window.sf['left_display']=0;
        return
    }
	var benci = window.sf['now'];
	for (var i = 0; i < window.sf['inLeft'] + 1; i += 1) {
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
