const BASE_URL = 'http://localhost:8787';

import type { BlogInput } from '@rishiraj04/medium-common';

export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

export interface BlogPost extends BlogInput {
    id: string;
    published: boolean;
    authorId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedBlogsResponse {
    blogs: BlogPost[];
    pagination: PaginationInfo;
}

export interface AuthResponse {
    token: string;
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
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                return { error: errorText || `HTTP ${response.status}` };
            }

            const data = await response.json();
            console.log('✅ Success response:', data);
            return { data };
        } catch (error) {
            console.error('💥 Network error:', error);
            return { error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    }

    async signin(data: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
        return this.request<AuthResponse>('/api/v1/user/signin', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async signup(data: { email: string; password: string; name?: string }): Promise<ApiResponse<AuthResponse>> {
        return this.request<AuthResponse>('/api/v1/user/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async fetchBlog(id: string): Promise<ApiResponse<BlogPost>> {
        const token = localStorage.getItem('token');
        return this.request<BlogPost>(`/api/v1/blog/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    async fetchBlogs(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedBlogsResponse>> {
        const token = localStorage.getItem('token');
        return this.request<PaginatedBlogsResponse>(`/api/v1/blog?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    async fetchMyBlogs(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedBlogsResponse>> {
        const token = localStorage.getItem('token');
        return this.request<PaginatedBlogsResponse>(`/api/v1/blog/my?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    async createBlog(data: BlogInput): Promise<ApiResponse<BlogPost>> {
        const token = localStorage.getItem('token');
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
        return this.request<BlogPost>(`/api/v1/blog/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id, ...data }),
        });
    }
}

export const apiClient = new ApiClient();

// Utility function to decode JWT and get user ID
export const getCurrentUserId = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        // JWT payload is the middle part (base64 encoded)
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.userId || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
