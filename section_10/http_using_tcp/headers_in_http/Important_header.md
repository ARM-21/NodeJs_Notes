http contains a request line\nmain_headers\n\ndata

we cannot access the headers directly from frontend, we need to allow the headers to be exposed to the frontend
we use Access-Control-Expose-Headers to expose the headers to the frontend
```
```js

## headers i have used in the backend
Access-Control-Allow-Origin: *
Access-Control-expose-headers: * or name
'content-type: application/json, text/txt, text/html; charset=utf-8'
 /** after reading content of specific length browser end the streams */
'content-length: 12'
content-disposition: attachment; filename="filename.txt"

```

```
```js 