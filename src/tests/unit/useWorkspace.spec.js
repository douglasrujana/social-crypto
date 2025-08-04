import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWorkspace } from '@/modules/juno/composables/useWorkspace';
import { useAnchorWallet } from 'solana-wallets-vue';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { ref } from 'vue';

// 1. Mockeamos la librería 'solana-wallets-vue'
vi.mock('solana-wallets-vue', () => ({
  useAnchorWallet: vi.fn(),
}));

// 2. Mockeamos la importación del IDL JSON con una estructura más completa
vi.mock('@/modules/juno/idl/juno.json', () => ({
  default: {
    version: '0.1.0',
    name: 'juno',
    metadata: {
      address: '2whHgHvjnQuVSsu3VzmFG4V5xdA8mniDCLASuzXjKAqh'
    },
    instructions: [
      {
        name: 'sendPost',
        accounts: [],
        args: []
      }
    ],
    accounts: [
      {
        name: 'Post',
        type: {
          kind: 'struct',
          fields: []
        }
      }
    ],
    errors: [],
    types: []
  }
}), { virtual: true });

// 3. Mockeamos las clases de Solana y Anchor para evitar errores de inicialización
vi.mock('@solana/web3.js', () => ({
  Connection: vi.fn().mockImplementation(() => ({
    getVersion: vi.fn().mockResolvedValue({ 'solana-core': '1.0.0' })
  })),
  PublicKey: vi.fn().mockImplementation((address) => ({
    toBase58: () => address || 'mockPublicKey',
    _bn: { toString: () => 'mock_bn' }
  })),
  clusterApiUrl: vi.fn().mockReturnValue('https://api.devnet.solana.com')
}));

vi.mock('@coral-xyz/anchor', () => ({
  AnchorProvider: vi.fn().mockImplementation((connection, wallet, opts) => ({
    connection,
    wallet,
    opts,
    publicKey: wallet?.publicKey
  })),
  Program: vi.fn().mockImplementation((idl, programId, provider) => ({
    programId,
    provider,
    rpc: {
      sendPost: vi.fn(),
      editPost: vi.fn(),
      likePost: vi.fn(),
      deletePost: vi.fn()
    },
    account: {
      post: {
        fetch: vi.fn(),
        fetchMultiple: vi.fn()
      }
    }
  }))
}));

describe('useWorkspace Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inicializa el provider y el program correctamente cuando la wallet está conectada', () => {
    // Arrange: Preparamos el mock de useAnchorWallet
    const mockPublicKey = { toBase58: () => 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS' };
    const mockWallet = {
      publicKey: mockPublicKey,
      signTransaction: vi.fn(),
      signAllTransactions: vi.fn()
    };
    // useAnchorWallet devuelve una Vue Ref, por lo que envolvemos el mock en ref()
    useAnchorWallet.mockReturnValue(ref(mockWallet));

    // Act: Llamamos al composable
    const { provider, program } = useWorkspace();

    // Assert: Verificamos las propiedades computadas
    // Accedemos a .value para que se ejecute la función computada
    expect(provider.value).toBeDefined();
    expect(program.value).toBeDefined();

    // Verificamos que se crearon las instancias correctas
    expect(AnchorProvider).toHaveBeenCalled();
    expect(Program).toHaveBeenCalled();
  });

  it('maneja de forma segura el caso de una wallet no conectada', () => {
    // Arrange: Simulamos una wallet desconectada (devuelve un ref a undefined)
    useAnchorWallet.mockReturnValue(ref(undefined));

    // Act
    const { provider, getWallet } = useWorkspace();

    // Assert
    // El constructor de AnchorProvider fallará si la wallet es undefined al acceder a .value.
    // Verificamos que la función getWallet devuelve 'guest' cuando no hay wallet conectada.
    expect(getWallet()).toBe('guest');

    // Verificamos que intentar acceder al provider (que depende de la wallet) lanza un error.
    // Esto es correcto, ya que no se puede crear un provider sin wallet.
    expect(() => provider.value).toThrow('Wallet no conectada');
  });

  it('la función isMyWallet funciona correctamente', () => {
    // Arrange: Preparamos el mock de la wallet conectada
    const mockWalletAddress = 'MyPublicKey12345';
    const mockWallet = {
      publicKey: { toBase58: () => mockWalletAddress },
    };
    useAnchorWallet.mockReturnValue(ref(mockWallet));

    // Act
    const { isMyWallet } = useWorkspace();

    // Assert: Caso Positivo
    expect(isMyWallet(mockWalletAddress)).toBe(true);

    // Assert: Caso Negativo
    expect(isMyWallet('AnotherPublicKey67890')).toBe(false);

    // Arrange: Simulamos wallet desconectada
    useAnchorWallet.mockReturnValue(ref(undefined));
    const { isMyWallet: isMyWalletDisconnected } = useWorkspace();

    // Assert: Caso Límite (Sin Wallet)
    expect(isMyWalletDisconnected(mockWalletAddress)).toBe(false);
    expect(isMyWalletDisconnected(undefined)).toBe(false);
  });

  it('debería cargar el IDL y crear el programa sin errores', () => {
    // Arrange: Preparamos el mock de la wallet conectada
    const mockWallet = {
      publicKey: { toBase58: () => 'mockPublicKey' },
      signTransaction: vi.fn(),
      signAllTransactions: vi.fn()
    };
    useAnchorWallet.mockReturnValue(ref(mockWallet));

    // Act
    const workspace = useWorkspace();

    // Assert
    expect(workspace.program).toBeDefined();
    expect(typeof workspace.program).toBe('object');
    expect(workspace.program.value).toBeDefined();
  });
});