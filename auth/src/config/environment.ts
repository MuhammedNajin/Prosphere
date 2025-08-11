import { z } from 'zod';

/**
 * @description Defines the schema for the application's environment variables using Zod.
 * This schema enforces type safety, presence, and format constraints for all required
 * environment variables.
 *
 * @property {string} NODE_ENV - The application's runtime environment.
 * @property {number} PORT - The port for the server to listen on.
 * @property {string} REDIS_URL - The full connection URL for the Redis instance.
 * @property {string} DATABASE_URL - The full connection string for the primary database.
 */

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  REDIS_URL: z.string().url({ message: "Invalid Redis URL" }).min(1, { message: "REDIS_URL is required" }),
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL is required" }),
  // Add other critical environment variables here
  // For example:
  // JWT_SECRET: z.string().min(32, { message: "JWT_SECRET must be at least 32 characters long" }),
  // API_KEY: z.string().uuid({ message: "API_KEY must be a valid UUID" }),
});

// We create a type from the schema to use with TypeScript's inference.
export type Env = z.infer<typeof envSchema>;


/**
 * @function validateEnv
 * @description Parses and validates the environment variables from `process.env`
 * against the defined `envSchema`.
 *
 * If validation fails, it logs a detailed, human-readable error message
 * listing all the validation issues and then terminates the application process.
 * This "fail-fast" approach prevents the app from running in a misconfigured state.
 *
 * @returns {Env} A fully validated and type-safe object of environment variables if validation succeeds.
 */
export const validateEnv = (): Env => {
  try {
    const validatedEnv = envSchema.parse(process.env);
    console.log('Environment variables validated successfully.');
    return validatedEnv;
  } catch (error) {
    // Check if the error is a Zod validation error.
    if (error instanceof z.ZodError) {
      console.error('Invalid environment variables. The application cannot start.');
      
      // The .flatten() method provides a clean, structured view of the errors.
      const { fieldErrors } = error.flatten();

      // Log each error in a user-friendly format.
      for (const key in fieldErrors) {
        if (Object.prototype.hasOwnProperty.call(fieldErrors, key)) {
          const messages = fieldErrors[key];
          if (messages) {
            console.error(`  - ${key}: ${messages.join(', ')}`);
          }
        }
      }
      
      console.error('\nPlease check your .env file or environment configuration and restart the server.');
    } else {
      // Log any other unexpected errors during startup.
      console.error('An unexpected error occurred during environment validation:', error);
    }
    
    // Exit the process with a failure code, preventing the app from running in a broken state.
    process.exit(1);
  }
};

/**
 * @description A fully validated and type-safe object containing all environment variables.
 * It is initialized by calling `validateEnv()`, ensuring that any module importing `env`
 * gets a configuration that has passed validation.
 */
export const env: Env = validateEnv();
