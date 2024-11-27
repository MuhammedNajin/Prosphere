 export interface UserProps {
    id: string
    username: string;
    email: string;
    avatar?: string;
    role?: string;
    status?: 'online' | 'offline' | 'away';
    lastSeen?: Date;
    phone?: string;
    about?: string;
}