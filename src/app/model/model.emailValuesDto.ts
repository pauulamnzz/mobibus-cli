export class ChangePasswordDto {
    password: string;
    confirmPassword: string;
    tokenPassword: string | null;
  
      constructor(password: string, confirmPassword: string, tokenPassword: string | null) {
          this.password = password;
          this.confirmPassword = confirmPassword;
          this.tokenPassword = tokenPassword;
      }
  } 