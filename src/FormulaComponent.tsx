import React from "react";
import { StoreProvider, useAction, useStore } from "easy-peasy";
import { Store } from "./formula";

type ActFunction = (acting: { id: string }) => void;

function UsesFormula() {
  const act: any = useAction(dispatch => dispatch.login);
  const isLoggedIn = useStore(state => state.isAuthenticated);
  return (
    <>
      <p>isLoggedIn = {isLoggedIn}</p>
      <button
        type="button"
        onClick={() => {
          act({ id: "id" });
        }}
      >
        Login
      </button>
    </>
  );
}

export default function FormulaComponent() {
  return (
    <StoreProvider store={Store}>
      <UsesFormula />
    </StoreProvider>
  );
}
