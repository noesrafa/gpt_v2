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
};
