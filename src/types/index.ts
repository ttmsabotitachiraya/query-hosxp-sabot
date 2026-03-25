export interface SqlCode {
  id: string;
  title: string;
  description: string | null;
  code: string;
  created_at: string;
  updated_at: string | null;
}

export interface CodeModalData {
  title: string;
  description: string;
  code: string;
}
