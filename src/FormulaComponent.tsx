import React from 'react';
import { StoreProvider, useAction, useStore } from 'easy-peasy';
import { Store } from './formula';

type ActFunction = (acting: { id: string }) => void;

function UsesFormula() {
  const act: any = useAction(dispatch => dispatch.login);
  const isLoggedIn = useStore(state => state.isAuthenticated);
  const deepValue = useStore(state => state.deep1.deep2.deepValue);
  const toggle: any = useAction(dispatch => ((dispatch.deep1 as any).deep2 as any).toggle);
  return (
    <>
      <p>isLoggedIn = {isLoggedIn}</p>
      <button
        type="button"
        onClick={() => {
          act({ id: 'id' });
        }}
      >
        Login
      </button>
      <p>deep = {deepValue ? 'true' : 'false'}</p>
      <button
        type="button"
        onClick={() => {
          toggle();
        }}
      >
        Toggle it
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
