cmake_minimum_required(VERSION 3.21)

project(NetSpeedWidget VERSION 1.0.4 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS ON)

add_compile_definitions(_UNICODE UNICODE NOMINMAX _WIN32_WINNT=0x0601 _WIN32_IE=0x0700)

if (MSVC)
    add_compile_options(/W4 /permissive- /EHsc)
endif()

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin")
foreach(CONFIG_TYPE Debug Release RelWithDebInfo MinSizeRel)
    string(TOUPPER "${CONFIG_TYPE}" CONFIG_TYPE_UPPER)
    set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_${CONFIG_TYPE_UPPER} "${CMAKE_BINARY_DIR}/bin")
endforeach()

add_executable(NetSpeedWidget WIN32
    src/main.cpp
    src/app/App.cpp
    src/app/Window.cpp
    src/monitor/NetworkMonitor.cpp
    src/monitor/SpeedCalculator.cpp
    src/ui/WidgetRenderer.cpp
    src/ui/TrayIcon.cpp
    src/core/Config.cpp
    src/core/Logger.cpp
    src/utils/Formatter.cpp
)

target_include_directories(NetSpeedWidget PRIVATE src)

target_link_libraries(NetSpeedWidget PRIVATE
    user32
    gdi32
    shell32
    iphlpapi
    ws2_32
    advapi32
)



if (MINGW)
    target_link_options(NetSpeedWidget PRIVATE -static -static-libgcc -static-libstdc++)
endif()

if (MSVC)
    target_link_options(NetSpeedWidget PRIVATE
        "/MANIFEST:EMBED"
        "/MANIFESTINPUT:${CMAKE_CURRENT_SOURCE_DIR}/src/NetSpeedWidget.manifest"
    )
endif()

set_target_properties(NetSpeedWidget PROPERTIES
    OUTPUT_NAME "NetSpeedWidget"
    VS_DEBUGGER_WORKING_DIRECTORY "${CMAKE_RUNTIME_OUTPUT_DIRECTORY}"
)
