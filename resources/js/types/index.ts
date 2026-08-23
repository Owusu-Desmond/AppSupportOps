export type * from './auth';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export interface ActivityUpdate {
    id: number;
    activity_id: number;
    user_id: number;
    status: 'pending' | 'done';
    remarks?: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Activity {
    id: number;
    title: string;
    description?: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    latest_update?: ActivityUpdate | null;
    updates?: ActivityUpdate[];
}


