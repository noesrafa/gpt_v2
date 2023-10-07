type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type Message = {
  role: "system" | "user";
  content: string;
  userName?: string;
};
