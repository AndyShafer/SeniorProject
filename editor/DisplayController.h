#pragma once

#include "DisplayState.h"
#include "Display.h"
#include "SelectionController.h"

class Display;

class DisplayController {
public:
	DisplayController(DisplayState *state, Display *display);
	void update();
	void run();
	void pause();
	void reset();
	void mouseMove(const wxPoint& position);
	void leftDown(const wxPoint& position);
	void leftUp(const wxPoint& position);
	void rightDown(const wxPoint& position);
	void rightUp(const wxPoint& position);
	void shiftDown();
	void shiftUp();
	void deletePressed();
private:
	DisplayState *displayState;
	SelectionController *selectionController;
	Display *display;
};
