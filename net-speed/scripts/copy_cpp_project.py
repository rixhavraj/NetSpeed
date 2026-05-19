import os
import shutil
import sys

def ignore_patterns(path, names):
    # Ignore compiled outputs, build directories, and IDE caches
    ignored = []
    for name in names:
        if name in ['.vs', 'build', 'out', 'dist', 'CMakeFiles', 'CMakeCache.txt'] or name.endswith('.user') or name.endswith('.exe') or name.endswith('.zip'):
            ignored.append(name)
    return ignored

def main():
    src_dir = r"c:\Users\rixha\WorkSpace\FullStack\net-speed"
    dest_dir = r"c:\Users\rixha\WorkSpace\FullStack\net-speed-web\net-speed"
    
    print(f"Copying C++ project from {src_dir} to {dest_dir}...")
    
    if os.path.exists(dest_dir):
        print("Destination folder already exists, removing it first...")
        try:
            shutil.rmtree(dest_dir)
        except Exception as e:
            print(f"Error removing destination: {e}")
            sys.exit(1)
            
    try:
        shutil.copytree(src_dir, dest_dir, ignore=ignore_patterns)
        print("C++ source files copied successfully.")
    except Exception as e:
        print(f"Error copying files: {e}")
        sys.exit(1)
        
    # Write a clean .gitignore specifically for the C++ project
    gitignore_path = os.path.join(dest_dir, ".gitignore")
    print(f"Creating C++ specific .gitignore at {gitignore_path}...")
    gitignore_content = """# C++ Widget Build and IDE Artifacts
.vs/
build/
out/
dist/
CMakeFiles/
CMakeCache.txt
Makefile
cmake_install.cmake
*.user
*.exe
*.zip
*.msi
*.msix
"""
    try:
        with open(gitignore_path, "w") as f:
            f.write(gitignore_content)
        print("  .gitignore created successfully.")
    except Exception as e:
        print(f"  Error creating .gitignore: {e}")

if __name__ == "__main__":
    main()
