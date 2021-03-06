#pragma once

#include <wx/wxprec.h>

#ifndef WX_PRECOMP
#include <wx/wx.h>
#endif

#include "Frame.h"
#include "Display.h"
#include "AppState.h"

class App : public wxApp {
	private:
		virtual bool OnInit();
		Display *display;
		AppState *appState;
		AppController *appController;
		UpdateTimer *timer;
};
