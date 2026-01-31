#!/usr/bin/env python3
# -*- coding: utf-8 -*-

file_path = r"c:\Users\yannb\Documents\1. Programmation\3. Bachata\Projet - site bachata V4\frontend\src\app\(site)\explore\page.tsx"

# Read the entire file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Line-by-line replacements
replacements = [
    # Line 330: Add indentation
    ('                </button>\r\n        </div>\r\n\r\n            {/* Planet Detail Panel */ }',
     '                </button>\r\n            </div>\r\n\r\n            {/* Planet Detail Panel */}'),
    
    # Fix the PlanetDetailPanel component indentation
    ('{/* Planet Detail Panel */}\r\n    <PlanetDetailPanel\r\n        isOpen={isPanelOpen}\r\n        onClose={handlePanelClose}\r\n        nodeData={selectedNodeData}\r\n        isLoading={isLoadingNode}\r\n    />\r\n        </main >',
     '{/* Planet Detail Panel */}\r\n            <PlanetDetailPanel\r\n                isOpen={isPanelOpen}\r\n                onClose={handlePanelClose}\r\n                nodeData={selectedNodeData}\r\n                isLoading={isLoadingNode}\r\n            />\r\n        </main>'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        print(f"✓ Replacement successful")
    else:
        print(f"✗ Pattern not found")

# Write back
with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print("\nFile modification complete!")

# Verify the file
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    print(f"Total lines in file: {len(lines)}")
