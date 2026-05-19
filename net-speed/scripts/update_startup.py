import os
import sys
import shutil
import subprocess
import winreg
import time

def kill_processes(names):
    print("Stopping running net-speed processes...")
    for name in names:
        try:
            # Taskkill with /F (force) and /IM (image name)
            subprocess.run(["taskkill", "/F", "/IM", name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"  Sent termination signal to any running {name}")
        except Exception as e:
            print(f"  Error terminating {name}: {e}")
    time.sleep(1)  # Wait for processes to exit and release file handles

def remove_file(filepath):
    if os.path.exists(filepath):
        print(f"Removing old version file: {filepath}")
        try:
            os.remove(filepath)
            print("  Successfully removed.")
        except Exception as e:
            print(f"  Failed to remove file: {e}")
            # Try force-deleting if it's locked
            try:
                subprocess.run(["cmd.exe", "/c", "del", "/f", "/q", filepath])
                print("  Force removed.")
            except Exception as e2:
                print(f"  Could not delete file: {e2}")

def set_startup_registry(app_name, exe_path):
    print(f"Setting startup registry key '{app_name}' to '{exe_path}'...")
    try:
        # Open registry key HKCU\Software\Microsoft\Windows\CurrentVersion\Run
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0,
            winreg.KEY_SET_VALUE
        )
        # Enclose path in quotes for safety
        winreg.SetValueEx(key, app_name, 0, winreg.REG_SZ, f'"{exe_path}"')
        winreg.CloseKey(key)
        print("  Registry key set successfully.")
    except Exception as e:
        print(f"  Failed to set registry key: {e}")

def main():
    # Paths
    root_dir = r"c:\Users\rixha\WorkSpace\FullStack\net-speed"
    new_make_path = os.path.join(root_dir, r"build\bin\NetSpeedWidget.exe")
    portable_dir = os.path.join(root_dir, r"dist\portable")
    portable_exe_path = os.path.join(portable_dir, "NetSpeedWidget.exe")
    old_download_path = r"C:\Users\rixha\Downloads\net-speed-v1.0.6.exe"
    
    # 1. Kill any running instances
    kill_processes(["net-speed-v1.0.6.exe", "NetSpeedWidget.exe"])
    
    # 2. Update the portable executable inside net-speed folder with the new make
    if not os.path.exists(new_make_path):
        print(f"ERROR: Could not find the new build at {new_make_path}!")
        print("Please compile the project first.")
        sys.exit(1)
        
    print(f"Updating the portable executable in net-speed folder...")
    os.makedirs(portable_dir, exist_ok=True)
    try:
        shutil.copy2(new_make_path, portable_exe_path)
        print(f"  Copied new build to: {portable_exe_path}")
    except Exception as e:
        print(f"  Failed to copy new build: {e}")
        # Try force copying with cmd shell
        try:
            subprocess.run(["cmd.exe", "/c", "copy", "/y", new_make_path, portable_exe_path])
            print("  Force copied using cmd.")
        except Exception as e2:
            print(f"  Could not copy: {e2}")
            sys.exit(1)
            
    # 3. Remove the old downloaded file from Downloads
    remove_file(old_download_path)
    
    # 4. Update the startup registry to point to the new portable path
    set_startup_registry("NetSpeedWidget", portable_exe_path)
    
    # 5. Start the new portable app
    print("Launching the new NetSpeedWidget startup app...")
    try:
        subprocess.Popen([portable_exe_path], cwd=portable_dir, creationflags=subprocess.CREATE_NEW_CONSOLE)
        print("  App launched successfully!")
    except Exception as e:
        print(f"  Failed to launch: {e}")

if __name__ == "__main__":
    main()
