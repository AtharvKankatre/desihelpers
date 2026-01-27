export interface IPayload {
  id?: string;
  email?: string;
  roles?: string[];
  isProfile?: boolean;
  iat?: number;
  exp?: number;
}
