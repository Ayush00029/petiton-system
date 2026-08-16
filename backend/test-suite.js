const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const runTests = async () => {
    console.log("==================================================");
    console.log(" FULL SYSTEM DIRECT AUTHENTICATION TEST RUNNER   ");
    console.log("==================================================\n");

    let citizenToken = "";
    let adminToken = "";
    let petitionId = "";
    let testEmail = `testuser_${Date.now()}@civicvoice.org`;

    try {

        // 2. User Registration (Direct Token)
        console.log(`Test 2: Register User (${testEmail})...`);
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: "Test User",
            email: testEmail,
            password: "password123",
            role: "citizen"
        });
        console.assert(regRes.data.success === true, "Registration failed");
        citizenToken = regRes.data.data.token;
        console.log(`✓ Registration Successful. Issued Token directly!\n`);

        // 3. Login Endpoint Check
        console.log("Test 3: Login User (Direct Authentication)...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: testEmail,
            password: "password123"
        });
        console.assert(loginRes.data.success === true, "Login failed");
        console.assert(!!loginRes.data.data.token, "Login token missing");
        console.log("✓ Direct Login Successful! Issued JWT Token.\n");

        // 4. Admin Login
        console.log("Test 4: Admin Authentication...");
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: "admin@civicvoice.org",
            password: "password123"
        });
        adminToken = adminLogin.data.data.token;
        console.assert(adminLogin.data.data.role === "admin", "Role should be admin");
        console.log("✓ Admin Login Passed\n");

        // 5. Create Valid Petition (Target: 5)
        console.log("Test 5: Create Petition...");
        const newPetition = await axios.post(
            `${BASE_URL}/petitions`,
            {
                title: "Fix Street Lights in Sector 4",
                description: "Broken street lights causing safety issues for residents at night.",
                category: "Street Lights",
                location: "Sector 4, New Delhi",
                targetSignatures: 5
            },
            { headers: { Authorization: `Bearer ${citizenToken}` } }
        );
        petitionId = newPetition.data.data._id;
        console.log(`✓ Petition Created (ID: ${petitionId})\n`);

        // 6. Admin Approve Petition
        console.log("Test 6: Admin Approve Petition...");
        const approveRes = await axios.put(
            `${BASE_URL}/petitions/admin/${petitionId}/status`,
            { status: "approved" },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.assert(approveRes.data.data.status === "approved", "Status should be approved");
        console.log("✓ Admin Approved Petition\n");

        // 7. Upvote Petition (1-Click Voting)
        console.log("Test 7: Upvote Petition (1-Click Voting)...");
        const voteRes = await axios.post(
            `${BASE_URL}/petitions/${petitionId}/vote`,
            {},
            { headers: { Authorization: `Bearer ${citizenToken}` } }
        );
        console.assert(voteRes.data.success === true, "Vote recording failed");
        console.log("✓ Vote Recorded Successfully!\n");

        console.log("==================================================");
        console.log(" ALL SYSTEM TESTS PASSED PERFECTLY!               ");
        console.log("==================================================");
    } catch (err) {
        console.error("❌ Test Failed:", err.response?.data || err.message);
    }
};

runTests();

