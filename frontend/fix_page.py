#!/usr/bin/env python3

file_path = r"c:\Users\yannb\Documents\1. Programmation\3. Bachata\Projet - site bachata V4\frontend\src\app\(site)\explore\page.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and fix the specific lines
for i in range(len(lines)):
    if i == 329:  # Line 330 (0-indexed)
        if '        </div>' in lines[i]:
            lines[i] = lines[i].replace('        </div>', '            </div>')
    elif i == 331:  # Line 332
        if '{/* Planet Detail Panel */ }' in lines[i]:
            lines[i] = lines[i].replace('{/* Planet Detail Panel */ }', '{/* Planet Detail Panel */}')
    elif i == 332:  # Line 333
        if '    <PlanetDetailPanel' in lines[i]:
            lines[i] = '            <PlanetDetailPanel\r\n'
    elif i == 333:  # Line 334
        if '        isOpen={isPanelOpen}' in lines[i]:
            lines[i] = '                isOpen={isPanelOpen}\r\n'
    elif i == 334:  # Line 335
        if '        onClose={handlePanelClose}' in lines[i]:
            lines[i] = '                onClose={handlePanelClose}\r\n'
    elif i == 335:  # Line 336
        if '        nodeData={selectedNodeData}' in lines[i]:
            lines[i] = '                nodeData={selectedNodeData}\r\n'
    elif i == 336:  # Line 337
        if '        isLoading={isLoadingNode}' in lines[i]:
            lines[i] = '                isLoading={isLoadingNode}\r\n'
    elif i == 337:  # Line 338
        if '    />' in lines[i]:
            lines[i] = '            />\r\n'
    elif i == 338:  # Line 339
        if '        </main >' in lines[i]:
            lines[i] = '        </main>\r\n'

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.writelines(lines)

print("File fixed successfully!")
