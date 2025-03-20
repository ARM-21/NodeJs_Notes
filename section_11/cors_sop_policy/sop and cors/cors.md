# 🌍 Cross-Origin Resource Sharing (CORS)

## 🔹 What is CORS?
CORS (**Cross-Origin Resource Sharing**) is a **security feature** enforced by web browsers that controls how web applications can request resources from different origins (domains, protocols, or ports).

By default, the **Same-Origin Policy (SOP)** blocks cross-origin requests for security reasons. CORS provides a secure way to allow certain requests.

---

## 🚀 How CORS Works?
When a browser makes a cross-origin request, the server must explicitly allow it using special **CORS headers**.

1. **If allowed** → The request proceeds.
2. **If denied** → The browser blocks the request.

**Example of Same-Origin vs. Cross-Origin:**
| Request From | Request To | Cross-Origin? |
|-------------|-----------|--------------|
| `https://example.com` | `https://example.com` | ❌ No |
| `https://example.com` | `https://api.example.com` | ✅ Yes |
| `http://localhost:3000` | `http://localhost:5000` | ✅ Yes |

---

## 📌 Types of CORS Requests
### ✅ 1. Simple Requests (Allowed Directly)
**Criteria:**
- Uses `GET`, `POST`, or `HEAD`
- Uses standard headers (`Content-Type: application/x-www-form-urlencoded`)

**Example:**
```js
fetch("https://api.example.com/data")
  .then(response => response.json())
  .then(data => console.log(data));
```

### ⚡ 2. Preflight Requests (OPTIONS Request First)
Used when the request contains **custom headers** or **non-simple methods** (`PUT`, `DELETE`, `PATCH`).

**Example:**
```js
fetch("https://api.example.com/update", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "John" })
});
```

---

## 🛡️ CORS Headers Explained
Servers use these **response headers** to control access.

| Header | Purpose |
|--------|---------|
| `Access-Control-Allow-Origin` | Defines allowed origins (`*` for all origins). |
| `Access-Control-Allow-Methods` | Specifies permitted HTTP methods (`GET, POST, PUT`). |
| `Access-Control-Allow-Headers` | Lists allowed headers (`Content-Type, Authorization`). |
| `Access-Control-Allow-Credentials` | Enables sending cookies/auth tokens. |

### 🎯 Example: Allow Specific Origin
```http
Access-Control-Allow-Origin: https://example.com
```

### 🌐 Example: Allow Any Origin
```http
Access-Control-Allow-Origin: *
```

---

## 🖥️ Handling CORS in Backend (Node.js + Express)
To enable CORS in a **Node.js Express** application:

```js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "https://example.com", credentials: true }));

app.get("/data", (req, res) => {
  res.json({ message: "CORS Enabled!" });
});

app.listen(3000, () => console.log("Server running"));
```

---

## 🎯 Key Takeaways
✅ **CORS is a security feature** that prevents unauthorized cross-origin requests.
✅ **It is enforced by browsers**, not the server.
✅ **Uses HTTP headers** to allow/deny requests from different origins.
✅ **Simple requests** are allowed directly, while **preflight requests** require extra checks.
✅ **Backend must configure CORS headers** properly to allow valid cross-origin requests.

---

### 📖 Further Reading
- [MDN Web Docs on CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Same-Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)

---

🚀 *Now you have a complete understanding of CORS!*
