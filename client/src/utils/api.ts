const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : { message: await response.text() };
    
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
    if (response.status === 400 && (data as any).errors) {
        const errorMessages = data.errors.map((err: any) => err.message).join(', ');
        throw new Error(errorMessages || data.message);
    }
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
};

let cachedCsrfToken: string | null = null;

const getCsrfToken = async () => {
    if (cachedCsrfToken) return cachedCsrfToken;
    try {
        const response = await fetch(`${API_URL}/csrf-token`, {
            credentials: 'include'
        });
        const data = await response.json();
        cachedCsrfToken = data.csrfToken;
        return cachedCsrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        return null;
    }
};

export const api = {
    get: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include'
        });
        return handleResponse(response);
    },

    post: async (endpoint: string, body: any, isFormData = false) => {
        const token = localStorage.getItem('token');
        const csrfToken = await getCsrfToken();
        
        const headers: any = {
            Authorization: `Bearer ${token}`,
            'X-CSRF-Token': csrfToken,
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: isFormData ? body : JSON.stringify(body),
            credentials: 'include'
        });

        return handleResponse(response);
    },

    put: async (endpoint: string, body: any) => {
        const token = localStorage.getItem('token');
        const csrfToken = await getCsrfToken();
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    delete: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const csrfToken = await getCsrfToken();
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken,
            },
            credentials: 'include'
        });
        return handleResponse(response);
    },

    patch: async (endpoint: string, body?: any) => {
        const token = localStorage.getItem('token');
        const csrfToken = await getCsrfToken();
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken,
            },
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'include'
        });
        return handleResponse(response);
    },
};
