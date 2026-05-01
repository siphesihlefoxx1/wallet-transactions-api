// Import Express framework (used to build APIs)
const express = require("express");

// Create an Express application (this is your API)
const app = express();

// Enable JSON parsing so we can read request bodies
app.use(express.json());

// Temporary in-memory storage (acts like a simple database)
let wallets = [];
let transactions = [];
/* First Ednpoint
|--------------------------------------------------------------------------
| CREATE WALLET ENDPOINT
|--------------------------------------------------------------------------
| Method: POST
| URL: /wallet/create
|
| Purpose:
| Creates a new wallet and returns it
*/
app.post("/wallet/create", (req, res) => {
  // Create a new wallet object
  // ID is generated based on array length (simple approach)
  const wallet = {
    id: wallets.length + 1,
  };

  // Store the wallet in our in-memory array
  wallets.push(wallet);

  // Return response:
  // 201 = Created (standard HTTP status for successful creation)
  res.status(201).json(wallet);
});

/*
|--------------------------------------------------------------------------
| START SERVER (ONLY WHEN RUN DIRECTLY)
|--------------------------------------------------------------------------
| This ensures:
| - The server runs when we execute the file
| - The server DOES NOT run when we import it in tests
*/
if (require.main === module) {
  // Start server on port 3000
  app.listen(3000, () => {
    // Log message to confirm server is running
    console.log("Server running on port 3000");
  });
}

// Export the app for testing purposes
// This allows test files to import the API without starting the server
module.exports = app;

/* SECOND Endpoint
|--------------------------------------------------------------------------
| GET WALLET BY ID
|--------------------------------------------------------------------------
| Method: GET
| URL: /wallet/:id
|
| Purpose:
| Retrieves a wallet using its ID
*/
app.get("/wallet/:id", (req, res) => {
  // Extract ID from URL
  const id = parseInt(req.params.id);

  // Find wallet in array
  const wallet = wallets.find((w) => w.id === id);

  // If wallet not found → return 404
  if (!wallet) {
    return res.status(404).send("Wallet not found");
  }

  // If found → return wallet
  res.json(wallet);
});

/* THIRD Endpoint 
|--------------------------------------------------------------------------
| CREATE TRANSACTION
|--------------------------------------------------------------------------
| Method: POST
| URL: /transactions
|
| Purpose:
| Creates a transaction for a wallet
*/
app.post("/transactions", (req, res) => {
  const { walletId, amount } = req.body;

  // Basic validation
  if (!walletId || !amount) {
    return res.status(400).send("walletId and amount required");
  }

  const transaction = {
    id: transactions.length + 1,
    walletId,
    amount,
  };

  transactions.push(transaction);

  res.status(201).json(transaction);
});

/* Fourth Endpoint
|--------------------------------------------------------------------------
| GET TRANSACTIONS FOR WALLET
|--------------------------------------------------------------------------
| Method: GET
| URL: /transactions/:walletId
|
| Purpose:
| Retrieves all transactions for a specific wallet
*/
app.get("/transactions/:walletId", (req, res) => {
  // Extract walletId from URL
  const walletId = parseInt(req.params.walletId);

  // Filter transactions for that wallet
  const result = transactions.filter((t) => t.walletId === walletId);

  // Return transactions
  res.json(result);
});
