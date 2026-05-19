#include "app/App.h"

App::App(HINSTANCE instance)
    : instance_(instance), window_(instance)
{
}

bool App::Initialize(int showCommand)
{
    return window_.Create(showCommand);
}

int App::Run()
{
    MSG message{};
    while (GetMessageW(&message, nullptr, 0, 0) > 0) {
        TranslateMessage(&message);
        DispatchMessageW(&message);
    }

    return static_cast<int>(message.wParam);
}
