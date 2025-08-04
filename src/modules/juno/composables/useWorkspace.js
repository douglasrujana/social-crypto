// [SOL-REF-001] Implementación de useWorkspace para manejo de conexión con Solana
// Importaciones necesarias para interactuar con Solana y Anchor
import { computed } from 'vue';
import { useAnchorWallet } from 'solana-wallets-vue';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import idl from '@/modules/juno/idl/juno.json';

const preflightCommitment = 'confirmed';
const commitment = 'confirmed';

// ID del programa obtenido del IDL
const programID = new PublicKey(idl.metadata.address);

// Función principal que provee el contexto de trabajo con Solana
export const useWorkspace = () => {

  // [SOL-REF-002] Configuración inicial de conexión y proveedor
  const wallet = useAnchorWallet();
  const connection = new Connection(clusterApiUrl('devnet'), commitment);

  // Proveedor de Anchor con configuración personalizada
  const provider = computed(() => {
    if (!wallet.value) {
      throw new Error('Wallet no conectada'); // [SOL-REF-003] Lanza error si no hay wallet
    }
    return new AnchorProvider(connection, wallet.value, { preflightCommitment, commitment });
  });

  // Programa de Anchor inicializado con el IDL
  const program = computed(() => {
    if (!provider.value) return null;
    return new Program(idl, programID, provider.value);
  });

  const getWallet = () => {
    try {
      if (!wallet || !wallet.value || !wallet.value.publicKey)
        return "guest";
      return wallet.value.publicKey.toBase58();
    } catch (error) {
      return "guest";
    }
  };

  const isMyWallet = (walletCompare) => {
    return getWallet() === walletCompare;
  }

  return { wallet, connection, provider, program, isMyWallet, getWallet };
}