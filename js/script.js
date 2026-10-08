const API_BASE_URL = "https://ewaste-management-backend.onrender.com";

const form = document.getElementById("ewasteForm");

if (form) {
    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const ewasteData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            type: document.getElementById("wasteType").value,
            quantity: parseInt(document.getElementById("quantity").value),
            condition: document.getElementById("condition").value,
            location: document.getElementById("location").value,
            description: document.getElementById("description").value
        };

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/ewaste`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(ewasteData)
                }
            );

            if (response.ok) {

                const result = await response.json();

                alert("E-Waste submitted successfully!");

                form.reset();

                console.log(result);

            } else {

                alert("Failed to submit e-waste.");

            }

        } catch (error) {

            console.error("Error:", error);

            alert("Could not connect to the server.");

        }

    });
}


// ================= DASHBOARD =================

const submissionTable = document.getElementById("submissionTable");

if (submissionTable) {

    async function loadDashboard() {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/ewaste`
            );

            const data = await response.json();

            // Total submissions
            document.getElementById("totalSubmissions").textContent = data.length;

            // Pending submissions
            const pending = data.filter(
                item => item.status === "Pending"
            );

            document.getElementById("pendingCollection").textContent =
                pending.length;

            // Recycled items
            const recycled = data.filter(
                item => item.status === "Recycled"
            );

            const recycledQuantity = recycled.reduce(
                (total, item) => total + item.quantity,
                0
            );

            document.getElementById("recycledItems").textContent =
                recycledQuantity;

            // Display submissions
            if (data.length === 0) {

                submissionTable.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-state">
                            No submissions yet.
                        </td>
                    </tr>
                `;

                return;
            }

            submissionTable.innerHTML = "";

            data.forEach(item => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.condition}</td>
                    <td>${item.location}</td>
                    <td>${item.status}</td>
                `;

                submissionTable.appendChild(row);

            });

        } catch (error) {

            console.error("Dashboard error:", error);

        }

    }

    loadDashboard();
}


// ================= MANAGE REQUESTS =================

const requestsTable = document.getElementById("requestsTable");

if (requestsTable) {

    async function loadRequests() {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/ewaste`
            );

            const data = await response.json();

            // Statistics
            document.getElementById("requestCount").textContent = data.length;

            const pending = data.filter(
                item => item.status === "Pending"
            );

            const assigned = data.filter(
                item => item.status === "Assigned"
            );

            const recycled = data.filter(
                item => item.status === "Recycled"
            );

            document.getElementById("pendingRequests").textContent =
                pending.length;

            document.getElementById("assignedRequests").textContent =
                assigned.length;

            document.getElementById("recycledRequests").textContent =
                recycled.length;


            // Empty table
            if (data.length === 0) {

                requestsTable.innerHTML = `
                    <tr>
                        <td colspan="8" class="empty-state">
                            No pickup requests yet.
                        </td>
                    </tr>
                `;

                return;
            }


            // Display requests
            requestsTable.innerHTML = "";

            data.forEach(item => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.quantity}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${item.status}</td>

                    <td>
                        <select onchange="changeStatus('${item.id}', this.value)">
                            <option value="">Update Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Collected">Collected</option>
                            <option value="Recycled">Recycled</option>
                        </select>
                    </td>
                `;

                requestsTable.appendChild(row);

            });

        } catch (error) {

            console.error("Request loading error:", error);

        }

    }

    loadRequests();

}


// ================= UPDATE STATUS =================

async function changeStatus(id, status) {

    if (!status) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/ewaste/${id}/status?status=${status}`,
            {
                method: "PUT"
            }
        );

        if (response.ok) {

            alert("Status updated successfully!");

            location.reload();

        } else {

            alert("Failed to update status.");

        }

    } catch (error) {

        console.error("Status update error:", error);

        alert("Could not connect to the server.");

    }

}


// ================= USER REGISTRATION =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const userData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            password: password,
            role: document.getElementById("role").value
        };

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                }
            );

            if (response.ok) {

                alert("Account created successfully!");

                registerForm.reset();

                window.location.href = "login.html";

            } else {

                alert("Registration failed. Email may already be registered.");

            }

        } catch (error) {

            console.error("Registration error:", error);

            alert("Could not connect to the server.");

        }

    });
}


// ================= USER LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    alert("LOGIN SCRIPT IS RUNNING");

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const selectedRole = document.getElementById("role").value;

        const loginData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/users/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loginData)
                }
            );

            if (response.ok) {

                const user = await response.json();

                // Check selected role against the user's actual role
                if (user.role !== selectedRole) {
                    alert("Incorrect role selected.");
                    return;
                }

                localStorage.setItem("loggedInUser", JSON.stringify(user));

                alert("Login successful!");

                // Redirect based on role
                if (user.role === "admin") {
                    window.location.href = "admin-dashboard.html";
                }
                else if (user.role === "collector") {
                    window.location.href = "collector-dashboard.html";
                }
                else {
                    window.location.href = "dashboard.html";
                }

            } else {

                alert("Invalid email or password.");

            }

        } catch (error) {

            console.error("Login error:", error);

            alert("Could not connect to the server.");

        }

    });
}