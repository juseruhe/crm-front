// client.model.ts
export interface Client {
    id?: number; // Puedes hacer esto opcional si es un nuevo cliente
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    mobile?: string;
    rewards?: number;
    membership?: number;
  }
  