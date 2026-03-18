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

let cachedCsrfToken: string | undefined = undefined;

const getCsrfToken = async (): Promise<string | undefined> => {
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
        return undefined;
    }
};

export const api = {
    get: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${endpoint}`, {
            headers,
            credentials: 'include'
        });
        return handleResponse(response);
    },

    post: async (endpoint: string, body: any, isFormData = false) => {
        const token = localStorage.getItem('token');
        const csrfToken = await getCsrfToken();
        
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
        if (!isFormData) headers['Content-Type'] = 'application/json';

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
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    delete: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const csrfToken = await getCsrfToken();
        
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
            credentials: 'include'
        });
        return handleResponse(response);
    },

    patch: async (endpoint: string, body?: any) => {
        const token = localStorage.getItem('token');
        const csrfToken = await getCsrfToken();
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers,
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'include'
        });
        return handleResponse(response);
    },
};
