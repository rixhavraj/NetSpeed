#include "app/App.h"

#include <windows.h>

int APIENTRY WinMain(HINSTANCE instance, HINSTANCE, LPSTR, int showCommand)
{
    // 1. Find if an existing instance is already running
    HWND hwndExisting = FindWindowW(L"NetSpeedWidgetWindow", NULL);
    if (hwndExisting) {
        // Send a close message to the old instance so it terminates cleanly
        SendMessageW(hwndExisting, WM_CLOSE, 0, 0);
        // Sleep briefly to let the thread and window resources release
        Sleep(500);
    }

    // 2. Enforce single-instance using a Named Mutex
    HANDLE hMutex = CreateMutexW(NULL, TRUE, L"Global\\NetSpeedWidgetSingleInstanceMutex");
    if (hMutex == NULL || GetLastError() == ERROR_ALREADY_EXISTS) {
        if (hMutex) {
            CloseHandle(hMutex);
        }
        return 0; // Prevent duplicate execution
    }

    App app(instance);
    if (!app.Initialize(showCommand)) {
        CloseHandle(hMutex);
        return 1;
    }

    int result = app.Run();

    CloseHandle(hMutex);
    return result;
}
