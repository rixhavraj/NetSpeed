#pragma once

#include "app/Window.h"

#include <windows.h>

class App {
public:
    explicit App(HINSTANCE instance);

    bool Initialize(int showCommand);
    int Run();

private:
    HINSTANCE instance_{};
    Window window_;
};
