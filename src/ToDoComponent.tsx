import React from 'react';
import { useStore, useAction, ModelValues, Dispatch } from 'easy-peasy';
import store, { Model } from './store';

export default function ToDoComponent(d: Dispatch<Model>) {
  const num = useStore((state: ModelValues<Model>) => state.todos.lengthOfItems);
  const deeper = useStore((state: ModelValues<Model>) => state.todos.deep.deeper.deeperValue);
  const deeperInc = useAction((dispatch: Dispatch<Model>) => dispatch.todos.deep.deeper.incrementDeeperValue);
  const save = useAction((dispatch: Dispatch<Model>) => dispatch.todos.saveTodo); // 👍 correct
  const counter = useStore((state: ModelValues<Model>) => state.counter);
  const justDispatch = useAction((dispatch: Dispatch<Model>) => {
    return {
      wut: dispatch.todos.deep.deeper.incrementDeeperValue,
      lol: dispatch,
    };
  }); // 👍 correct
  const jd = useAction((dispatch: Dispatch<Model>) => dispatch);
  const c = useStore((state: ModelValues<Model>) => state.todos.deep.deeper.deeperValue);

  return (
    <>
      <p>
        There {num === 1 ? 'is' : 'are'} {num} todo{num === 1 ? '' : 's'} and the counter is {counter}. Deeper value is{' '}
        {deeper}
      </p>
      <button
        type="button"
        onClick={() => {
          save('another');
        }}
      >
        Add a todo
      </button>
      <button
        type="button"
        onClick={() => {
          store.dispatch({ type: 'INCREMENT' });
          store.dispatch.todos.saveTodo('sort typings');
        }}
      >
        Incremement counter
      </button>
      <button type="button" onClick={deeperInc}>
        Incremement deeper
      </button>
    </>
  );
}
