// version: 0.3
const styles = `
/* Pop up display tree */
.popup-style {
    position: fixed !important;
    z-index: 100 !important;
    background: var(--left-pane-background-color, #f0f0f0) !important;
  }
  .dropdown-menu-left {
  	z-index: 101 !important;
  }
  `;

let style = document.createElement('style');
style.innerHTML = styles;
document.head.appendChild(style);

let mouseInLeft = false;
let mouseInlauncherPane = false;
let leftPane, tree, menu, lb, launcherPane, restPane;
let needHiddenleft = false;
function disablePop() {
	if (tree !== undefined) {
		tree.classList.remove("popup-style");
	}
	if (needHiddenleft) {
		if (lb.classList.contains('bx-chevrons-left')) lb.click();
	}
	needHiddenleft = false;
}
function enablePop() {
	if (tree !== undefined) {
		tree.classList.add("popup-style");
	}
	if (lb.classList.contains('bx-chevrons-right')) {
		lb.click();
		needHiddenleft = true;
	}
	setTimeout(() => {
		leftPane.querySelector(".scroll-to-active-note-button").click();
	}, 200);
}

function getEle() {
	leftPane = document.querySelector("#left-pane");
	if (!leftPane) {
		return false;
	}
	tree = leftPane.querySelector(".tree");
	if (!tree) {
		return false;
	}
	menu = leftPane.querySelector("#context-menu-container");
	restPane = document.querySelector("#rest-pane");
	launcherPane = document.querySelector("#launcher-pane");
	lb = launcherPane.querySelector(".launcher-button.bx-chevrons-right, .launcher-button.bx-chevrons-left");
	if (!leftPane || !tree || !launcherPane) {
		return false;
	}
	// Monitor mouse
	leftPane.addEventListener("mouseenter", () => {
		mouseInLeft = true;
	});
	leftPane.addEventListener("mouseleave", () => {
		mouseInLeft = false;
	});
	launcherPane.addEventListener("mouseenter", () => {
		mouseInlauncherPane = true;
	});
	launcherPane.addEventListener("mouseleave", () => {
		mouseInlauncherPane = false;
	});
	restPane.addEventListener("mouseenter", () => {
		mouseInLeft = false;
		disablePop();
	});

	// Monitor keyboard
	let altKeyPressTime = 0; // Record Alt key press time
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Alt' && altKeyPressTime === 0 && !event.ctrlKey && !event.shiftKey) {
			altKeyPressTime = Date.now();
		}
	});
	document.addEventListener('keyup', function (event) {
		if (event.key === 'Alt' && altKeyPressTime > 0) {
			const pressDuration = Date.now() - altKeyPressTime; // Calculate press duration
			altKeyPressTime = 0;
			if (pressDuration < 200) {
				if (mouseInLeft || mouseInlauncherPane) {
					if (tree.classList.contains("popup-style")) {
						disablePop();
					} else {
						enablePop();
					}
				}
			}
		}
	});

	setTimeout(() => {
		$(launcherPane).find('.spacer.component').on('click', (event) => {
			if (tree !== undefined) {
				if (tree.classList.contains("popup-style")) {
					disablePop();
				} else {
					enablePop();
				}
			}
		});
	}, 500)
	return true;
}

setTimeout(() => {
	if (!getEle()) {
		setTimeout(() => {
			if (!getEle()) {
				setTimeout(() => {
					getEle();
				}, 3000)
			}
		}, 1000)
	}
}, 200)

module.exports = class extends api.NoteContextAwareWidget {
	static get parentWidget() { return 'note-detail-pane'; }
	constructor() { super(); }
	isEnabled() { return true; }
	doRender() { this.$widget = $(''); return this.$widget; }
	async refreshWithNote() { disablePop(); }
}