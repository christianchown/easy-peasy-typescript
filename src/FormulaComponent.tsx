import React from 'react';
import { StoreProvider, useAction, useStore, Dispatch } from 'easy-peasy';
import { Store, Model } from './formula';

type ActFunction = (acting: { id: string }) => void;

function UsesFormula() {
  const act = useAction((dispatch: Dispatch<Model>) => dispatch.login);
  const isLoggedIn = useStore(state => state.isAuthenticated);
  const deepValue = useStore(state => state.deep1.deep2.deepValue);
  const toggle: any = useAction((dispatch: Dispatch<Model>) => dispatch.deep1.deep2.toggle);
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
