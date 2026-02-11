const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const handleResponse = async (response: Response) => {
    const data = await response.json();
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }
    
    // Handle 429 Too Many Requests - rate limit exceeded
    if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
    }
    
    // Handle 400 Bad Request - validation errors
    if (response.status === 400 && data.errors) {
        const errorMessages = data.errors.map((err: any) => err.message).join(', ');
        throw new Error(errorMessages || data.message);
    }
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
};

export const api = {
    get: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },

    post: async (endpoint: string, body: any, isFormData = false) => {
        const token = localStorage.getItem('token');
        const headers: any = {
            Authorization: `Bearer ${token}`,
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });

        return handleResponse(response);
    },

    put: async (endpoint: string, body: any) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },

    patch: async (endpoint: string, body?: any) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        return handleResponse(response);
    },
};
