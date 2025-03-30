Cookies are small pieces of data stored on a user's browser by a website. They are used to remember information about the user between visits or during a session. Cookies are sent with HTTP requests and responses, allowing the server and client to maintain state in an otherwise stateless protocol.

Key Features of Cookies:
Storage: Cookies are stored as key-value pairs in the browser.
Scope: They are associated with a specific domain and path, meaning they can only be accessed by the domain that set them.
Expiration: Cookies can have an expiration date. If no expiration is set, they are considered session cookies and are deleted when the browser is closed.
Security: Cookies can be marked as HttpOnly (accessible only by the server) or Secure (sent only over HTTPS).
Common Uses:
Session Management: Tracking logged-in users or shopping cart data.
Personalization: Storing user preferences like themes or language.
Analytics: Tracking user behavior for analytics purposes.


### Setting Cookies from the Server
To set cookies from the server, you typically include a `Set-Cookie` header in the HTTP response. This header instructs the browser to store the cookie with the specified attributes.
### Example of Setting Cookies from the Server
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Strict
Set-Cookie: theme=dark; Path=/; Expires=Wed, 21 Oct 2025 07:28:00 GMT
Content-Length: 0
```
### Explanation of the Example
