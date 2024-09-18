# Project Name

## Overview
This project utilizes npx to search for and execute binaries or files in the current working directory (CWD). Depending on the presence of a `package.json` file, npx behaves differently to locate and run the specified file.

## npx Behavior

### Case 1: If `package.json` is Present in the CWD
1. **Step 1**: npx searches for a `package.json` file in the current directory.
2. **Step 2**: It checks for the `name` key inside the `package.json` file.
   - If the `name` key exists, npx searches for the `bin` key.
   - If the `bin` key is found, it executes the file mentioned under the `bin` key.

### Case 2: If `package.json` is Not Present in the CWD
1. **Step 1**: npx looks for the `node_modules` folder in the current directory.
   - It then searches for the file inside the `.bin` folder within `node_modules`.
   - If the file is found, npx executes it.

### Case 3: If the File is Not Found
1. **Step 1**: If the file is not found in the `node_modules` folder where global file are installed, 
2.npx searches package in the npm folder online .

### Case 4: If the File is Not Found
1. **Step 1**: If the file is not found in the `node_modules` folder where global file are installed,
3.if not found it searches in npx_cache folder in the user directory.
2. npx searches package in the npm folder online .
4.if not found throws error.


## What Does npx Do?

npx is a command-line tool that searches for a file or binary (e.g., JavaScript files, shell scripts) and executes it, either from the local `node_modules` or the npm registry. You can run commands without globally installing them, which makes it efficient for running one-time tasks or specific binaries.

## Getting Started

1. Make sure you have Node.js installed on your machine.
2. To run the script, use the following command:
   ```bash
   npx <command-name>
