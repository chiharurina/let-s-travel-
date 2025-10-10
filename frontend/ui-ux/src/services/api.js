// Custom error class for more detailed API error information
export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

// General API Fetch Helper
export async function apiFetch(url, options = {}) {
    const config = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
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
