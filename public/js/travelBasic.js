function ui_required()
{
	/*
	if(sectionFocus === 0)
	{
		ui_activate(ui.R);

		hint_activate(ui.HINT_R);
	}
	
	else if(sectionFocus === 1)
	{
		ui_activate(ui.R);
		ui_activate(ui.L);

		hint_activate(ui.HINT_R);
		hint_activate(ui.HINT_L);	
	}
	
	else if(sectionFocus === 2)
	{
		ui_activate(ui.R);
		ui_activate(ui.L);

		hint_activate(ui.HINT_R);
		hint_activate(ui.HINT_L);	
	}
	
	else if(sectionFocus === 3)
	{
		ui_activate(ui.L);

		hint_activate(ui.HINT_L);	
	}
	*/

	// STRING IF STATEMENT IN JSON READ WITH eval();
	eval(system.data.LEVELS[level].ui_required);

	control_on();
}

function ui_path(direction, keyInput)
{
	let activated = false;

	/*
	switch(sectionFocus)
	{
		case 0:
		{
			if(direction === "R")
			{
				section_request(1);
				activated = true;
				player.playerDirection("F");
			}
			
			break;
		}
		
		case 1:
		{
			if(direction === "R")
			{
				section_request(2);
				activated = true;
				player.playerDirection("F");
			}
			
			else if(direction === "L")
			{
				section_request(0);
				activated = true;
				player.playerDirection("B");
			}
			
			break;
		}
		
		case 2:
		{
			if(direction === "R")
			{
				section_request(3);
				activated = true;
				player.playerDirection("F");
			}
			
			else if(direction === "L")
			{
				section_request(1);
				activated = true;
				player.playerDirection("B");
			}
			
			break;
		}
		
		case 3:
		{	
			if(direction === "L")
			{
				section_request(2);
				activated = true;
				player.playerDirection("B");
			}
			
			break;
		}
	}
	*/

	// STRING IF STATEMENT IN JSON READ WITH eval();
	eval(system.data.LEVELS[level].ui_path);

	if(activated && keyInput)
	{
		ui_reset();
		hint_reset();

		player.playerWalk(true);
	}
}