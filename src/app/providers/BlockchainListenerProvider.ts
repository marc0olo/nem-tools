import {BlockchainListener} from 'nem-library';

export function BlockchainListenerProvider(): BlockchainListener {
  return new BlockchainListener();
}
