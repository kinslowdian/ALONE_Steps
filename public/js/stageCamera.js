class Camera
{
	constructor(main)
	{
		this.htmlAttach = main;
		this.viewerAdvanced = false;
	}

	updateResizeCamera()
	{
		this.w = this.htmlAttach.offsetWidth;
		this.h = this.htmlAttach.offsetHeight;
		
		this.x = 0;
		this.y = 0;
	}

	connectViewer(div)
	{
		this.viewer = div;
		this.viewW = this.viewer.offsetWidth;
		this.viewH = this.viewer.offsetHeight;
		
		this.viewer.x = 0;
		this.viewer.y = 0;
	}
	
	connectViewerOther(div)
	{
		this.viewerAdvanced = true;
		this.viewerOther = div;
	}
	
	connectPlayer(obj)
	{
		this.player = obj;
	}

	viewerFind(target)
	{
		let vf = {};

		vf.cx = -(target.x) + ((this.w * 0.5) - (target.w * 0.5));
		vf.cy = -(target.y) + ((this.h * 0.5) - (target.h * 0.5));

		this.viewerShift(vf.cx, vf.cy);
	}

	viewerShift(x, y)
	{
		this.viewer.x = x;
		this.viewer.y = y;
		
		if(this.viewer.x != this.x || this.viewer.y != this.y)
		{
			this.viewerTransition();
			this.player.playerMoveTo(sectionsARR[sectionFocus]);
		}
	}

	viewerTransition()
	{
		this.viewer.addEventListener("transitionend", this.viewerTransitionEvent, false);

		this.viewer.setAttribute("style", "transform: translate(" + this.viewer.x + "px, " + this.viewer.y + "px);");
		
		if(this.viewerAdvanced)
		{
			this.viewerOther.setAttribute("style", "transform: translate(" + -(this.viewer.x * 0.25) + "px, " + -(this.viewer.y * 0.25) + "px);");
		}
	}

	// OUT OF SCOPE HIGH BUG CHANCE WITH JS ISSUES
	viewerTransitionEvent(event)
	{
		let caller = event.target.attributes["data-instance"].value;

		if(caller === "viewer")
		{
			event.target.removeEventListener("transitionend", this.viewerTransitionEvent, false);

			// LINK BACK VALUES
			camera_newFocus();
		}
	}

	viewerUpdateValues()
	{
		this.x = this.viewer.x;
		this.y = this.viewer.y;	
	}
}

class Section
{
	constructor(w, h, props)
	{
		this.htmlAttach = null

		this.w = w;
		this.h = h;	
		this.parentLayer = props.parentLayer;
		this.num = props.num_ref;
		this.x = props.x;
		this.y = props.y;
		this.bg = props.devVis;
		this.isAnItem = props.isAnItem;
		this.htmlBuild = "";
		this.classBuild = 'section' + this.num;

		this.build();
	}

	build()
	{
		this.htmlBuild = '<div class="section ' + this.classBuild + '"><p>' + this.num + '</p></div>';
	}

	list(htmlAttach)
	{
		this.htmlAttach = htmlAttach;

		this.placement();
	}

	placement()
	{
		this.htmlAttach.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; transform: translate(" + this.x + "px, " + this.y + "px); background: " + this.bg + ";");
	}

	attachItem(obj)
	{
		this.itemObj = obj;
	}
}

class Player
{
	constructor(htmlAttach, htmlAttachInner, htmlAttachBase, htmlAttachLegL, htmlAttachLegR, w, h, x, y)
	{
		this.htmlAttach = htmlAttach;
		this.htmlAttachInner = htmlAttachInner;
		this.htmlAttachBase = htmlAttachBase;
		this.htmlAttachLegL = htmlAttachLegL;
		this.htmlAttachLegR = htmlAttachLegR;
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;

		this.playerWalk(false);
	}

	playerAddThought(htmlAttachThought)
	{
		this.thinking = false;
		this.htmlAttachThought = htmlAttachThought;
	}
	
	playerMoveTo(target)
	{
		let x = target.x + (target.w * 0.5);
		let y = target.y + (target.h * 0.5);
		
		this.htmlAttach.setAttribute("style", "transform: translate(calc(" + x + "px - " + (this.w * 0.5) + "px), calc(" + y + "px - " + (this.h * 0.5) + "px));");

		if(this.thinking)
		{
			this.playerThink(false);
		}
	}

	playerDirection(dir)
	{
		if(dir == "F")
		{
			this.htmlAttachInner.classList.remove("player-back");

			this.htmlAttachThought.classList.remove("player-back");
		}

		else if(dir == "B")
		{
			this.htmlAttachInner.classList.add("player-back");

			this.htmlAttachThought.classList.add("player-back");
		}
	}

	playerWalk(allow)
	{
		if(allow)
		{
			this.htmlAttachBase.classList.add("player-walk");
			this.htmlAttachLegL.classList.add("player-walk-legL");
			this.htmlAttachLegR.classList.add("player-walk-legR");
		}

		else
		{
			this.htmlAttachBase.classList.remove("player-walk");
			this.htmlAttachLegL.classList.remove("player-walk-legL");
			this.htmlAttachLegR.classList.remove("player-walk-legR");
		}
	}

	playerThink(allow)
	{
		if(allow)
		{
			this.thinking = true;
			this.htmlAttachThought.classList.add("thought-thinking");
		}

		else
		{
			this.thinking = false;
			this.htmlAttachThought.classList.remove("thought-thinking");
		}
	}
}


var CAM; 
var displayList;
var resizeTimeout;
var sectionsARR;
var sectionFocus;

var ui;

var player;

var system;
var level = 0;

var itemEvent;

function project_ios_fix_init()
{
	document.addEventListener("gesturestart", project_ios_fix_event, false);
	// document.addEventListener("touchstart", project_ios_fix_event, false);
	document.addEventListener("touchcancel", project_ios_fix_event, false);
}

function project_ios_fix_event(event)
{
	event.preventDefault();
}

function section_init()
{
	sectionsARR = new Array();

	for(let i  = 0; i < system.data.LEVELS[level].sections.length; i++)
	{
		displayList["section" + i] = {};

		let s = new Section(110, 250, system.data.LEVELS[level].sections[i]);

		sectionsARR.push(s);
	}

	section_add();
}

function section_add()
{
	let htmlString = "";

	for(let i in sectionsARR)
	{
		if(!sectionsARR[i].isAnItem)
		{
			htmlString += sectionsARR[i].htmlBuild;
		}
	}

	displayList.layerSections.innerHTML = htmlString;

	section_display();
}

function section_display()
{
	for(let i in sectionsARR)
	{
		if(!sectionsARR[i].isAnItem)
		{
			displayList["section" + sectionsARR[i].num_ref] = document.querySelector("." + sectionsARR[i].classBuild);
			sectionsARR[i].list(displayList["section" + sectionsARR[i].num_ref]);
		}
	}
}

function section_request(num)
{
	if(num != sectionFocus)
	{
		sectionFocus = num;
		
		CAM.viewerFind(sectionsARR[sectionFocus]);
	}
}

function player_init()
{
	trace(displayList.player);

	player = new Player(displayList.player, displayList.playerInner, displayList.playerBase, displayList.playerLegL, displayList.playerLegR, 110, 250, 0, 0);
	player.playerAddThought(displayList.playerThought);
	player.playerDirection("F");
	
	CAM.connectPlayer(player);
}


function camera_init()
{
	CAM = new Camera(displayList.camera);

	CAM.updateResizeCamera();
	CAM.connectViewer(displayList.viewer);
	CAM.connectViewerOther(displayList.layer0);
}

// ON END OF CAMERA TRANSITIONS
function camera_newFocus()
{
	trace("camera_newFocus();")

	CAM.viewerUpdateValues();

	player.playerWalk(false);
	
	ui_required();

	if(sectionsARR[sectionFocus].isAnItem)
	{
		player.playerThink(true);
	}
}

function ui_init()
{
	ui = {};
	
	ui.U = {};
	ui.D = {};
	ui.L = {};
	ui.R = {};
	
	ui.list = new Array();
	
	ui.U.htmlAttach = document.querySelector(".ui .ui-u");
	ui.D.htmlAttach = document.querySelector(".ui .ui-d");
	ui.L.htmlAttach = document.querySelector(".ui .ui-l");
	ui.R.htmlAttach = document.querySelector(".ui .ui-r");
	
	ui.list.push(ui.U);
	ui.list.push(ui.D);
	ui.list.push(ui.L);
	ui.list.push(ui.R);
	
	for(let i in ui.list)
	{
		ui.list[i].show = false;
		ui.list[i].hasEvent = false;
	}

	ui.HINT_U = {};
	ui.HINT_D = {};
	ui.HINT_L = {};
	ui.HINT_R = {};

	ui.hintList = new Array();

	ui.HINT_U.htmlAttach = document.querySelector(".ui-hint .ui-u");
	ui.HINT_D.htmlAttach = document.querySelector(".ui-hint .ui-d");
	ui.HINT_L.htmlAttach = document.querySelector(".ui-hint .ui-l");
	ui.HINT_R.htmlAttach = document.querySelector(".ui-hint .ui-r");

	ui.hintList.push(ui.HINT_U);
	ui.hintList.push(ui.HINT_D);
	ui.hintList.push(ui.HINT_L);
	ui.hintList.push(ui.HINT_R);

	for(let j in ui.hintList)
	{
		ui.hintList[j].show = false;
	}
}

function ui_required()
{
	// STRING IF STATEMENT IN JSON READ WITH eval();
	eval(system.data.LEVELS[level].ui_required);

	control_on();
}

function ui_path(direction, keyInput)
{
	let activated = false;

	// STRING IF STATEMENT IN JSON READ WITH eval();
	eval(system.data.LEVELS[level].ui_path);

	if(keyInput)
	{
		if(activated)
		{
			ui_reset();
			hint_reset();
		}
	}

	if(activated)
	{
		if(!itemEvent)
		{
			player.playerWalk(true);
		}
	}
}

function ui_activate(obj)
{
	obj.show = true;
	obj.hasEvent = true;
	obj.htmlAttach.classList.remove("ui-default");
	obj.htmlAttach.addEventListener("click", ui_event, false);
	obj.htmlAttach.addEventListener("touchstart", ui_event, false);
	obj.htmlAttach.addEventListener("touchend", ui_event, false);
}

function ui_reset()
{
	for(let i in ui.list)
	{
		if(ui.list[i].show)
		{
			ui.list[i].show = false;
			ui.list[i].htmlAttach.classList.add("ui-default");	
		}
		
		
		if(ui.list[i].hasEvent)
		{
			ui.list[i].htmlAttach.removeEventListener("click", ui_event, false);
			ui.list[i].htmlAttach.removeEventListener("touchstart", ui_event, false);
			ui.list[i].htmlAttach.removeEventListener("touchend", ui_event, false);
		}
	}

	control_off();	
}

function ui_event(event)
{
	let direction; 
	
	event.preventDefault();
	
	if(event.type === "touchstart")
	{
		event.target.classList.add("ui-touch");
	}
	
	else if(event.type === "click" || event.type === "touchend")
	{
		ui_reset();
		hint_reset();
		
		if(event.type === "touchend")
		{
			event.target.classList.remove("ui-touch");
		}
		
		direction = event.target.dataset.direction;
		
		ui_path(direction, false);	
	}
}

function hint_activate(obj)
{
	obj.show = true;
	obj.htmlAttach.classList.remove("ui-default");
}

function hint_reset()
{
	for(let i in ui.hintList)
	{
		if(ui.hintList[i].show)
		{
			ui.hintList[i].show = false;
			ui.hintList[i].htmlAttach.classList.add("ui-default");	
		}
	}
}

function item_found()
{
	itemEvent = true;

	trace(sectionsARR[sectionFocus]);
}


//// GENREAL STAGE

function resize_init(run)
{
	if(run)
	{
		window.addEventListener("resize", resize_throttler, false);
	}

	else
	{
		window.removeEventListener("resize", resize_throttler, false);
	}
}

function resize_throttler()
{
	if(!resizeTimeout)
	{
		resizeTimeout = setTimeout(resize_call, 66);
	}
}

function resize_call()
{
	resizeTimeout = null;
	resize_apply();
}

function resize_apply()
{
	CAM.updateResizeCamera();
	CAM.viewerFind(sectionsARR[sectionFocus]);
}







