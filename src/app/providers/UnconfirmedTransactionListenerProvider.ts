import {UnconfirmedTransactionListener} from 'nem-library';

export function UnconfirmedTransactionListenerProvider(): UnconfirmedTransactionListener {
  return new UnconfirmedTransactionListener();
}
