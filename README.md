# Pi Network Payment Flow Backend

This Node.js script sets up a backend server to handle payment approvals and completions using the Pi Network API. Below is an explanation of the key components and flow of the application.

---

## Key Components

### Dependencies
The script uses the following dependencies:
- **`express`**: For creating the server and handling HTTP requests.
- **`http`**: For creating the HTTP server.
- **`axios`**: For making HTTP requests to the Pi Network API.
- **`cors`**: For enabling Cross-Origin Resource Sharing.

### Constants
- **`CURRENT_VERSION`**: Tracks the version of the application.
- **`piNetworkApi`**: The base URL for the Pi Network API.
- **`API_KEY`**: The API key used for authenticating requests to the Pi Network API.
- **`port`**: The port on which the server listens (3005).

---

## Routes

### Homepage (`GET /`)
The server serves the `index.html` file when the root URL (`/`) is accessed.

```javascript
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


Approve Payment (POST /approve)
This endpoint handles payment approval by sending a POST request to the Pi Network API.
```js
app.post('/approve', async (req, res) => {
  const { paymentId } = req.body; // Extract paymentId from the request body
  try {
    // Send a POST request to approve the payment
    await axios.post(`https://${piNetworkApi}/payments/${paymentId}/approve`, {}, {
      headers: {
        'Authorization': `Key ${API_KEY}` // Include API key in the headers
      }
    });

    // Respond with success
    return res.status(200).send({
      message: 'Payment approved!',
      status: 'success'
    });
  } catch (err) {
    console.log(err); // Log the error for debugging

    // Respond with an error message
    return res.status(500).send({
      message: `There has been an error!`,
      status: 'error'
    });
  }
});
```

GitHub Copilot
Here’s how the explanation can be written into a Markdown file:

1 vulnerability
Approve Payment (POST /approve)
This endpoint handles payment approval by sending a POST request to the Pi Network API.

Complete Payment (POST /complete)
This endpoint finalizes a payment by sending a POST request to the Pi Network API with a transaction ID (txid).

```js

app.post('/complete', async (req, res) => {
  const { paymentId, txid } = req.body; // Extract paymentId and txid from the request body
  try {
    // Send a POST request to complete the payment
    await axios.post(`https://${piNetworkApi}/payments/${paymentId}/complete`, {
      txid // Include the transaction ID in the request body
    }, {
      headers: {
        'Authorization': `Key ${API_KEY}` // Include API key in the headers
      }
    });

    // Respond with success
    return res.status(200).send({
      message: 'Payment completed!',
      status: 'success'
    });
  } catch (err) {
    console.log(err); // Log the error for debugging

    // Respond with an error message
    return res.status(500).send({
      message: `There has been an error!`,
      status: 'error'
    });
  }
});
```
Server Initialization
The server listens on port 3005 and logs a message when it starts.
```js
server.listen(port);
console.log('Connected');
```
Payment Flow Summary
Approve Payment (/approve):

The client sends a POST request with a paymentId.
The server sends a request to the Pi Network API to approve the payment.
If successful, it responds with a success message.
Complete Payment (/complete):

The client sends a POST request with a paymentId and txid.
The server sends a request to the Pi Network API to complete the payment.
If successful, it responds with a success message.
