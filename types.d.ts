type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type Message = {
  role: string;
  content: string;
  userName?: string;
  component?: string | null;
};

type TrebleRequest = {
  country_code: string;
  cellphone: string;
  session_id: string;
  conversation_id: number;
  question: Question;
  sent_at: string;
  sent_text: string;
  user_session_keys: UserSessionKey[];
  responded_at: string;
  actual_response: string;
};

export interface Question {
  type: string;
  text: string;
}

export interface UserSessionKey {
  key: string;
  value: string;
  type: null;
}
