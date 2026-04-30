# EXERCISE: 5.4 — Status Code
**Instruction:** Create a file called status-codes.md (markdown, not code). For each scenario below, write the HTTP status code you'd return and a one-sentence explanation:

1. User successfully logged in

    **200 OK** - The request succeeded and the server returns the authenticated session or token, user us logged in.

2. User tried to access a page without being logged in

    **401 Unauthorized** - The request was blocked because no valid authentication credentials or invalid token were provided.

3. User is logged in but tried to access another user's private data

    **403 Forbidden** - The user is authenticated, but access is denied due to authorization rules (e.g., RBAC or permission checks).

4. User requested a blog post that doesn't exist

    **404 Not Found** - The requested blog post entry does not exist in the server.

5. User successfully created a new task

    **201 Created** - The request was successful and a new resource was created on the server.

6. User sent a POST request with invalid JSON

    **400 Bad Request** - The server rejected the request due to malformed or invalid JSON payload during validation.

7. User deleted a task successfully (no data to return)

    **204 No Content** - The delete operation succeeded and no response body is returned.

8. Database is down and the server can't handle the request

    **503 Service Unavailable** - The server is temporarily unable to process the request due to overload or maintenance (Database is down)

9. User exceeded the rate limit

    **429 Too Many Requests** - The request was rejected because the user sent too many requests in a short period (Rate limiting).

10. User requested data and got it successfully


    **200 OK** - The request succeeded and the server returned the requested data.

