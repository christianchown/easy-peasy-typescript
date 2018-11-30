import React from "react";
import { useStore, useAction, ModelActions } from "easy-peasy";
import store, { Model } from "./store";

export default function ToDoComponent() {
  const num = useStore<Model, number>(state => state.todos.lengthOfItems); //    👍 correct
  const save = useAction<Model, string>(dispatch => dispatch.todos.saveTodo); // 👍 correct
  const counter = useStore<Model, number>(state => state.counter); //            👍 correct

  // useStore<Model, number>(state => state.todos.items);
  // 👍 correctly errors - (string[] is not assignable to number)

  //  useAction<Model, number>(dispatch => dispatch.todos.saveTodo);
  // 👍 correctly errors - (payload incompatible - number is not assignable to string)

  return (
    <>
      <p>
        There {num === 1 ? "is" : "are"} {num} todo{num === 1 ? "" : "s"} and
        the counter is {counter}
      </p>
      <button
        type="button"
        onClick={() => {
          save("another");
        }}
      >
        Add a todo
      </button>
      <button
        type="button"
        onClick={() => {
          store.dispatch({ type: "INCREMENT" });
        }}
      >
        Incremement counter
      </button>
    </>
  );
}
