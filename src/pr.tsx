import React from 'react';
import {
  createStore,
  effect,
  reducer,
  select,
  useStore,
  useAction,
  Action,
  Effect,
  Reducer,
  Select,
  ModelValues,
  Dispatch,
} from 'easy-peasy';
import { Action as ReduxAction } from 'redux';
import todoService from './toDoService';

interface TodoValues {
  items: Array<string>;
}

interface TodoValuesAndSelectors extends TodoValues {
  lengthOfItems: number;
}

interface TodoActions {
  saveTodo: Effect<Model, string, Promise<number>>;
  todoSaved: Action<TodoValuesAndSelectors, string>;
  lengthOfItems: Select<TodoValuesAndSelectors, number>;
}

interface Model {
  todos: TodoValues & TodoActions;
  counter: Reducer<number>;
}

const store = createStore<Model>({
  todos: {
    items: [],

    saveTodo: effect(async (dispatch, payload, getState) => {
      const saved = await todoService.save(payload);
      dispatch.todos.todoSaved(saved); // 👍 correctly typed

      // dispatch.todos.todoSaved(1);
      // 👍 errors! (1 is not assignable to string)

      // dispatch.notToDos.something();
      // 👍 errors! (notToDos does not exist on Dispatch<Model>)

      const { lengthOfItems } = getState().todos; // 👍 correctly typed
      if (lengthOfItems > 10) {
        await todoService.reportBigUsage();
      }
      return lengthOfItems;
    }),

    todoSaved: (state, payload) => {
      state.items.push(payload); // 👍 correctly typed

      // state.items.push(1);
      // 👍 correctly errors! (1 is not assignable to string)

      if (state.lengthOfItems > 10) {
        // 👍 correctly typed
      }
    },

    lengthOfItems: select(state => {
      return state.items.length; // 👍 correctly typed
    }),
  },

  counter: reducer((state, action: ReduxAction) => {
    // 👍 correctly typed
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      default:
        return state;
    }
  }),
});

function TodoComponent() {
  const num = useStore((state: ModelValues<Model>) => state.todos.lengthOfItems); // 👍 correct
  const save = useAction((dispatch: Dispatch<Model>) => dispatch.todos.saveTodo); // 👍 correct
  const counter = useStore((state: ModelValues<Model>) => state.counter); //         👍 correct

  // const num: number = useStore((state: ModelValues<Model>) => state.todos.items);
  // 👍 correctly errors - (string[] is not assignable to number)

  // const a: (payload: number) => void = useAction((dispatch: Dispatch<Model>) => dispatch.todos.saveTodo);
  // 👍 correctly errors - (payload incompatible - number is not assignable to string)

  return (
    <>
      <p>
        There are {num} components and the counter is {counter}
      </p>
      <button
        type="button"
        onClick={() => {
          save('another');
        }}
      >
        Add another!
      </button>
    </>
  );
}
