# CommonJS vs ES6 Modules

This project demonstrates the differences between CommonJS (CJS) and ES6 Modules (ESM) in JavaScript, focusing on their file loading behavior, syntax differences, and configurations.

## CommonJS (CJS)
- **File Loading**: Synchronous
- **Imports**: Not hoisted
- **Top-Level `await`**: Not allowed
- **Exports**: Only one value can be exported
- **File Extension**: Optional
- **File Path**: If the full file path is provided, we can load any file using CJS.
- **File Extension Convention**: It is a convention to add `.cjs` in the file extension when working with CommonJS.
- **Package Configuration**: It is optional to set `"type": "commonjs"` in `package.json`. By default, CJS uses `module.exports`.
- **`this` Keyword**: `this` is points to module.exports{} in the module scope in ESM.
- **`Exported` value**: only one value (either object or array or other) can be exported from a module because a function can only return one function
- **`filename and dirname` value**: we can use `__filename` and `__dirname` to get the current file name and directory name.
- **Strict Mode**: CJS is not always in strict mode. "use strict"
## ES6 Modules (ESM)
- **File Loading**: Asynchronous
- **Imports**: Hoisted
- **Top-Level `await`**: Allowed
- **File Extension**: Mandatory
- **Allowed Files**: Only `.js` and `.mjs` files are allowed for module imports.
- **File Extension Convention**: It is a convention to add `.mjs` in the file extension when working with ES6 modules.
- **Package Configuration**: We need to set `"type": "module"` in `package.json`.
- **`this` Keyword**: `this` is undefined in the module scope in ESM.
- **`Exported` value**: multiple value can be exported from a module
- **`filename and dirname` value**: we use `import.meta.url` to get the current file name and directory name.
- **Strict Mode**: ESM is always in strict mode."
