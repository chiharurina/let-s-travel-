// Custom error class for more detailed API error information
export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

// MOCK AUTH CONFIGS: use for testing while backend is still setting up
// Automatically handles auth endpoints during development: /api/login, /api/me, /api/logout
const MOCK_AUTH_ENABLED = true;

const MOCK_USERS = {
    "you@example.com": {
        id: 1,
        email: "you@example.com",
        name: "Example user",
        password: "password",
    },
    "a@a.com": {
        id: 2,
        email: "a@a.com",
        name: "John Doe",
        password: "123",
    },
};

function handleMockAuth(url, options) {
    if (!MOCK_AUTH_ENABLED) return null;

    // mock /api/login
    if (url === "/api/login" && options.method === "POST") {
        const body = JSON.parse(options.body);
        const { email, password } = body;
        const user = MOCK_USERS[email];

        if (user && user.password === password) {
            const mockUser = {
                id: user.id,
                email: user.email,
                name: user.name,
            };
            setMockSession(mockUser);
            return { success: true, user: mockUser };
        }

        throw new ApiError("Invalid email or password", 401, null);
    }

    // mock /api/me
    if (url === "/api/me" && options.method === "GET") {
        const mockUser = getMockSession();
        if (mockUser) {
            return mockUser;
        }
        throw new ApiError("Not authenticated", 401, null);
    }

    // mock /api/logout
    if (url === "/api/logout" && options.method === "POST") {
        clearMockSession();
        return { success: true };
    }

    return null; // Return null if not an auth endpoint
}

function getMockSession() {
    if (typeof window === "undefined") return null;
    try {
        const stored = window.sessionStorage.getItem(
            "lets-travel:mock-session"
        );
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

function setMockSession(user) {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.setItem(
            "lets-travel:mock-session",
            JSON.stringify(user)
        );
    } catch (error) {
        console.error("Failed to persist mock session", error);
    }
}

function clearMockSession() {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.removeItem("lets-travel:mock-session");
    } catch (error) {
        console.error("Failed to clear mock session", error);
    }
}

// General Mock Functions
function isMockEnabled(options) {
    return options && Object.prototype.hasOwnProperty.call(options, "mockResponse");
}

async function resolveMockResponse(mockResponse, mockDelay) {
    if (mockDelay) {
        await new Promise((resolve) => setTimeout(resolve, mockDelay));
    }

    return typeof mockResponse === "function" ? mockResponse() : mockResponse;
}

// General API Fetch Helper
export async function apiFetch(url, options = {}) {
    // Check for mock auth endpoints first
    const mockAuthResult = handleMockAuth(url, options);
    if (mockAuthResult !== null) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return mockAuthResult;
    }

    if (isMockEnabled(options)) {
        const { mockResponse, mockDelay = 0 } = options;
        return resolveMockResponse(mockResponse, mockDelay);
    }

    const { mockResponse, mockDelay, ...restOptions } = options;

    const config = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...restOptions.headers,
        },
        ...restOptions,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new ApiError(
                errorData?.message ||
                    `API Request failed with status ${response.status}`,
                response.status,
                errorData
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            error.message || "Network error occurred",
            null,
            null
        );
    }
}

// Helper methods

export async function get(url, options = {}) {
    return apiFetch(url, {
        method: "GET",
        ...options,
    });
}

export async function post(url, body, options = {}) {
    return apiFetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        ...options,
    });
}

export async function put(url, body, options = {}) {
    return apiFetch(url, {
        method: "PUT",
        body: JSON.stringify(body),
        ...options,
    });
}

export async function del(url, options = {}) {
    return apiFetch(url, {
        method: "DELETE",
        ...options,
    });
}

// Helper for external API calls that do not need credentials
export async function externalApiFetch(url, options = {}) {
    const { credentials, ...restOptions } = options;

    return apiFetch(url, {
        ...restOptions,
        credentials: "omit",
    });
}
