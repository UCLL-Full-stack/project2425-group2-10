// back-end/model/userInfo.ts

export interface UserInfo {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin'; // Role is a required property
  }
  