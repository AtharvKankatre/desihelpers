export interface IUrgent {
  name: string;
  code: boolean;
}

export const urgentOptions: IUrgent[] = [
  { code: true, name: "Yes" },
  { code: false, name: "No" },
];
