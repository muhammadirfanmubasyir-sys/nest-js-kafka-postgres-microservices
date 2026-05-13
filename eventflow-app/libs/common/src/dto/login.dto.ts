import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Please provide a valid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string = "";

    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be 6 characters long'})
    @IsNotEmpty({ message: 'Password is required' })
    password: string = "";

}

export class ResetPasswordDto {
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string = "";

}