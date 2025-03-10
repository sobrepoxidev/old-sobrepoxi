//tipo global de tu DB

export type Database = {
  ticket_types: {
    id: number;
    name: string;
    date: string;
    time: string;
    min_number: number;
    max_number: number;
    created_at: string;
    updated_at: string;
    costo: number;
    premio: string;
    availables: number;
    image_url: string | null;
    min_serie: number;
    max_serie: number;
  },
  user_tickets: {
    id: number;
    local_id: number;
    name: string;//
    ticket_type_id: string | null;
    user_id: string | null;
    number: number | null;
    serie: number | null;
    premio: string;
    costo: number;
    is_locked: boolean;
    purchase_date: Date | null;
    custom_design: string | null;
    created_at?: string;
    order_id: string | null;
    image_url: string | null;//
    min_serie: number;//
    max_serie: number;//
    min_number: number;
    max_number: number;
    date: string;
    time: string;
  },
  products: {
    id: string;
    created_at: string;
    image_url: string | null;
    name: string | null;
    description: string | null;
  },
  orders: {
    id: string;
    user_id: string;
    payment_method: string;
    payment_status: string;
    payment_reference: string | null;
    total_amount: number;
    created_at: string;
    updated_at: string;
  }
}
