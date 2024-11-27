import { UserProps } from "../interface/IUser";

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class User {
    private readonly id?: string;
    private email: string;
    private name: string;
    private age?: number;
    private phoneNumber?: string;
    private createdAt?: Date;
    private updatedAt?: Date;

    private static readonly NAME_MIN_LENGTH = 2;

     constructor(props: UserProps) {
        this.id = props.id;
        this.email = props.email;
        this.name = props.name;
        this.age = props.age;
        this.phoneNumber = props.phoneNumber;
        this.createdAt = props.createdAt ?? new Date();
        this.updatedAt = props.updatedAt ?? new Date();
    }

    /**
     * Creates a new User instance after validating the input
     * @param props User properties
     * @returns New User instance
     */
    public static async create(props: UserProps): Promise<User> {
        await User.validateProps(props);
        return new User(props)
    }

    /**
     * Validates all user properties
     * @param props Properties to validate
     */
    private static async validateProps(props: UserProps): Promise<void> {
        const errors: string[] = [];

        if (!props.email) {
            errors.push('Invalid email address');
        }

        if (!props.name || props.name.trim().length < User.NAME_MIN_LENGTH) {
            errors.push(`Name must be at least ${User.NAME_MIN_LENGTH} characters long`);
        }

        if (props.age !== undefined && (props.age < 13 || props.age > 120)) {
            errors.push('Age must be between 13 and 120');
        }

        if (props.phoneNumber && !User.isValidPhoneNumber(props.phoneNumber)) {
            errors.push('Invalid phone number format');
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }
    }

    /**
     * Validates phone number format
     * @param phoneNumber Phone number to validate
     */
    private static isValidPhoneNumber(phoneNumber: string): boolean {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phoneNumber);
    }

    // Getters
    public getId(): string | undefined { return this.id; }
    public getEmail(): string { return this.email; }
    public getName(): string { return this.name; }
    public getAge(): number | undefined { return this.age; }
    public getPhoneNumber(): string | undefined { return this.phoneNumber; }
    public getCreatedAt(): Date | undefined { return this.createdAt; }
    public getUpdatedAt(): Date | undefined { return this.updatedAt; }
} 