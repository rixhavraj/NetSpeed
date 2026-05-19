#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0600
#endif

#include "monitor/NetworkMonitor.h"
#include "core/Logger.h"

#include <winsock2.h>
#include <ws2tcpip.h>
#include <windows.h>
#include <winerror.h>
#include <iphlpapi.h>

bool NetworkMonitor::ReadSnapshot(NetworkSnapshot& outSnapshot) const
{
    outSnapshot = NetworkSnapshot{};

    static bool wsaInitialized = false;
    if (!wsaInitialized) {
        WSADATA wsaData;
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) == 0) {
            wsaInitialized = true;
        }
    }

    DWORD dwBestIfIndex = 0;
    if (GetBestInterface(inet_addr("8.8.8.8"), &dwBestIfIndex) != NO_ERROR) {
        Logger::Write(L"GetBestInterface failed");
        return false;
    }

    MIB_IFROW row{};
    row.dwIndex = dwBestIfIndex;
    if (GetIfEntry(&row) != NO_ERROR) {
        Logger::Write(L"GetIfEntry failed");
        return false;
    }

    outSnapshot.bytesReceived = row.dwInOctets;
    outSnapshot.bytesSent = row.dwOutOctets;

    return true;
}
