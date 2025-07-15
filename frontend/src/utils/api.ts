const BASE_URL = 'http://localhost:8787';

import type { 
    BlogInput, 
    SigninInput, 
    SignupInput
} from '@rishiraj04/medium-common';

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    details?: unknown;
}

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    author: {
        name: string | null;
        email?: string;
    };
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
}

export interface PaginatedBlogsResponse {
    blogs: BlogPost[];
    pagination: PaginationInfo;
}

export interface User {
    id: string;
    email: string;
    name: string | null;
}

export interface AuthResponse {
    token: string;
    user: User;
}

class ApiClient {
    private async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${BASE_URL}${endpoint}`;
            console.log('🚀 Making request to:', url);
            console.log('📤 Request options:', options);
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            console.log('📥 Response status:', response.status);
            console.log('📥 Response ok:', response.ok);

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    console.error('❌ Error response:', errorData);
                    return { 
                        error: errorData.error || errorData.message || `HTTP ${response.status}`,
                        details: errorData.details 
                    };
                } catch {
                    const errorText = await response.text();
                    console.error('❌ Error response (text):', errorText);
                    return { error: errorText || `HTTP ${response.status}` };
                }
            }

            const data = await response.json();
            console.log('✅ Success response:', data);
            
            // Handle direct data responses (like auth) vs wrapped responses (like paginated blogs)
            if (data.token || data.blogs || data.id) {
                return { data };
            }
            
            return { data };
        } catch (error) {
            console.error('💥 Network error:', error);
            return { error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    }

    async signin(data: SigninInput): Promise<ApiResponse<AuthResponse>> {
        return this.request<AuthResponse>('/api/v1/user/signin', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async signup(data: SignupInput): Promise<ApiResponse<AuthResponse>> {
        return this.request<AuthResponse>('/api/v1/user/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async fetchBlog(id: string): Promise<ApiResponse<BlogPost>> {
        const token = localStorage.getItem('token');
        return this.request<BlogPost>(`/api/v1/blog/${id}`, {
            method: 'GET',
            headers: token ? {
                'Authorization': `Bearer ${token}`,
            } : {},
        });
    }

    async fetchBlogs(page: number = 1, limit: number = 10, search?: string): Promise<ApiResponse<PaginatedBlogsResponse>> {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({ 
            page: page.toString(), 
            limit: limit.toString() 
        });
        
        if (search) {
            params.append('search', search);
        }
        
        return this.request<PaginatedBlogsResponse>(`/api/v1/blog/bulk?${params.toString()}`, {
            method: 'GET',
            headers: token ? {
                'Authorization': `Bearer ${token}`,
            } : {},
        });
    }

    async fetchMyBlogs(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedBlogsResponse>> {
        const token = localStorage.getItem('token');
        if (!token) {
            return { error: 'Authentication required' };
        }
        
        return this.request<PaginatedBlogsResponse>(`/api/v1/blog/my?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    async createBlog(data: BlogInput): Promise<ApiResponse<BlogPost>> {
        const token = localStorage.getItem('token');
        if (!token) {
            return { error: 'Authentication required' };
        }
        
        return this.request<BlogPost>('/api/v1/blog', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    }

    async updateBlog(id: string, data: { title?: string; content?: string; published?: boolean }): Promise<ApiResponse<BlogPost>> {
        const token = localStorage.getItem('token');
        if (!token) {
            return { error: 'Authentication required' };
        }
        
        return this.request<BlogPost>(`/api/v1/blog/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    }

    async deleteBlog(id: string): Promise<ApiResponse<{ message: string }>> {
        const token = localStorage.getItem('token');
        if (!token) {
            return { error: 'Authentication required' };
        }
        
        return this.request<{ message: string }>(`/api/v1/blog/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    // Health check
    async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; version: string }>> {
        return this.request('/health');
    }
}

export const apiClient = new ApiClient();

// Utility function to decode JWT and get user info
export const getCurrentUser = (): { userId: string } | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        // JWT payload is the middle part (base64 encoded)
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return { userId: decoded.userId };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getCurrentUser();
};

// Logout utility
export const logout = (): void => {
    localStorage.removeItem('token');
};
