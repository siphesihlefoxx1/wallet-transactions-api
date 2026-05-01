/*
|--------------------------------------------------------------------------
| AUTOMATED TESTS FOR WALLET TRANSACTIONS API
|--------------------------------------------------------------------------
| Purpose:
| These tests validate the behaviour of the API endpoints automatically.
| Instead of manually calling the API (e.g. using curl), the tests simulate
| requests and verify that the system responds correctly.
|
| Tools Used:
| - Jest: Test runner (executes the tests)
| - Supertest: Used to simulate HTTP requests to the API
|
| These tests will later be executed automatically in the CI/CD pipeline
| to ensure that all code changes are validated before being accepted.
|--------------------------------------------------------------------------
*/

// Import Supertest (used to simulate API requests)
const request = require("supertest");

// Import the API application
// Note: This imports the app WITHOUT starting the server
const app = require("../src/app");

/*
|--------------------------------------------------------------------------
| TEST SUITE: Wallet API
|--------------------------------------------------------------------------
| Groups all wallet-related tests together
|--------------------------------------------------------------------------
*/
describe("Wallet API Tests", () => {
  /*
    |--------------------------------------------------------------------------
    | TEST CASE: Create Wallet
    |--------------------------------------------------------------------------
    | Purpose:
    | Verifies that a wallet can be successfully created
    |
    | Expected behaviour:
    | - API returns HTTP 201 (Created)
    | - Response contains a wallet object with an ID
    |--------------------------------------------------------------------------
    */
  it("should create a wallet", async () => {
    // Simulate POST request to create a wallet
    const response = await request(app).post("/wallet/create");

    // Validate HTTP status code
    expect(response.statusCode).toBe(201);

    // Validate that response contains an ID property
    expect(response.body).toHaveProperty("id");
  });

  /*
    |--------------------------------------------------------------------------
    | TEST CASE: Get Wallet by ID
    |--------------------------------------------------------------------------
    | Purpose:
    | Verifies that an existing wallet can be retrieved
    |
    | Expected behaviour:
    | - API returns HTTP 200 (OK)
    | - Response contains the correct wallet ID
    |--------------------------------------------------------------------------
    */
  it("should retrieve a wallet by ID", async () => {
    // First create a wallet
    const createResponse = await request(app).post("/wallet/create");

    const walletId = createResponse.body.id;

    // Retrieve the wallet
    const response = await request(app).get(`/wallet/${walletId}`);

    // Validate response
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(walletId);
  });

  /*
    |--------------------------------------------------------------------------
    | TEST CASE: Create Transaction
    |--------------------------------------------------------------------------
    | Purpose:
    | Verifies that a transaction can be created for a wallet
    |
    | Expected behaviour:
    | - API returns HTTP 201 (Created)
    | - Response contains walletId and amount
    |--------------------------------------------------------------------------
    */
  it("should create a transaction for a wallet", async () => {
    // Create wallet first
    const walletResponse = await request(app).post("/wallet/create");

    const walletId = walletResponse.body.id;

    // Create transaction
    const response = await request(app).post("/transactions").send({
      walletId: walletId,
      amount: 100,
    });

    // Validate response
    expect(response.statusCode).toBe(201);
    expect(response.body.walletId).toBe(walletId);
    expect(response.body.amount).toBe(100);
  });

  /*
    |--------------------------------------------------------------------------
    | TEST CASE: Get Transactions for Wallet
    |--------------------------------------------------------------------------
    | Purpose:
    | Verifies that transactions can be retrieved for a specific wallet
    |
    | Expected behaviour:
    | - API returns HTTP 200 (OK)
    | - Response contains an array of transactions
    |--------------------------------------------------------------------------
    */
  it("should retrieve transactions for a wallet", async () => {
    // Create wallet
    const walletResponse = await request(app).post("/wallet/create");

    const walletId = walletResponse.body.id;

    // Create transaction
    await request(app).post("/transactions").send({
      walletId: walletId,
      amount: 200,
    });

    // Retrieve transactions
    const response = await request(app).get(`/transactions/${walletId}`);

    // Validate response
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
