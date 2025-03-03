//tipo global de tu DB

export type Database = {
    ticket_types: {
      id: string
      name: string
      date: string
      time: string
      min_number: number
      max_number: number
      min_series: number
      max_series: number
    }
      user_tickets: {
          id: string
          ticket_type_id: string
          number: number
          series: number
          is_locked: boolean
          purchase_date: Date
      }
  }