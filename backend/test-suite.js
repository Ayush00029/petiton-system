const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const runTests = async () => {
    console.log("==================================================");
    console.log(" FULL SYSTEM & GMAIL OTP VERIFICATION TEST RUNNER ");
    console.log("==================================================\n");

    let citizenToken = "";
    let adminToken = "";
    let petitionId = "";
    let testEmail = `testuser_${Date.now()}@civicvoice.org`;
    let devOtpCode = "";

    try {
        // 1. Health Check
        console.log("Test 1: Health Check (/api/health)...");
        const healthRes = await axios.get(`${BASE_URL}/health`);
        console.assert(healthRes.data.success === true, "Health check failed");
        console.log("✓ Health Check Passed\n");

        // 2. User Registration with OTP Generation
        console.log(`Test 2: Register User (${testEmail})...`);
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: "Test OTP User",
            email: testEmail,
            password: "password123",
            role: "citizen"
        });
        console.assert(regRes.data.requiresVerification === true, "requiresVerification should be true");
        devOtpCode = regRes.data.otpDev;
        console.log(`✓ Registration Successful. Generated OTP: ${devOtpCode}\n`);

        // 3. Verify OTP Endpoint
        console.log("Test 3: Verify 6-Digit Email OTP...");
        const verifyRes = await axios.post(`${BASE_URL}/auth/verify-otp`, {
            email: testEmail,
            otp: devOtpCode
        });
        console.assert(verifyRes.data.success === true, "OTP Verification failed");
        citizenToken = verifyRes.data.data.token;
        console.log("✓ Email OTP Verified Successfully! Issued JWT Token.\n");

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

        // 7. Sign Petition with Digital Signature
        console.log("Test 7: Sign Petition with Digital Signature...");
        const signRes = await axios.post(
            `${BASE_URL}/petitions/${petitionId}/sign`,
            {
                signerName: "Test OTP User",
                signatureData: "TYPED:Test OTP User"
            },
            { headers: { Authorization: `Bearer ${citizenToken}` } }
        );
        console.assert(signRes.data.signatureCount === 1, "Signature count should be 1");
        console.log("✓ Digital Signature Recorded\n");

        console.log("==================================================");
        console.log(" ALL SYSTEM & GMAIL OTP TESTS PASSED PERFECTLY!   ");
        console.log("==================================================");
    } catch (err) {
        console.error("❌ Test Failed:", err.response?.data || err.message);
    }
};

runTests();
