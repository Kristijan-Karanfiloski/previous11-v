import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice
} from '@reduxjs/toolkit';
import axios from 'axios';

interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const getTodosAction = createAsyncThunk(
  'todo/getTodos',
  async (arg, thunkApi) => {
    const data = await axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then((resp) => resp.data)
      .catch((err) => {
        console.log('[getTodosAction] err', err);
        return thunkApi.rejectWithValue(err);
      });
    if (!data) {
      return thunkApi.rejectWithValue('No data');
    }

    console.log('[getUserProfileThunk]', data);
    thunkApi.dispatch(addManyTodos(data));
    return data;
  }
);

const todosAdapter = createEntityAdapter<ITodo>({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => a.id - b.id
});

export const todoSlice = createSlice({
  name: 'todo',
  initialState: todosAdapter.getInitialState(),
  reducers: {
    addTodo: todosAdapter.addOne,
    updateTodo: todosAdapter.updateOne,
    removeTodo: todosAdapter.removeOne,
    addManyTodos: todosAdapter.addMany
  }
});

export const { addTodo, updateTodo, removeTodo, addManyTodos } =
  todoSlice.actions;

export const todosSelector = todosAdapter.getSelectors(
  (state: any) => state.todo
);
// export const allTodos = todosSelectors.selectAll((state: any) => state.todo);
export default todoSlice.reducer;
