
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useJunoStore } from '@/store/juno';
import { useWorkspace } from '@/modules/juno/composables';

// 1. Mockeamos el composable useWorkspace
// Vitest interceptará cualquier llamada a este archivo y devolverá nuestro mock.
vi.mock('@/modules/juno/composables/useWorkspace', () => ({
  useWorkspace: vi.fn(),
}));

describe('Juno Store (Pinia)', () => {
  // Antes de cada prueba, creamos una nueva instancia de Pinia
  // para asegurar que las pruebas estén aisladas.
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('la acción sendPost llama al RPC del smart contract y actualiza el estado', async () => {
    // 2. Arrange (Preparación)

    // Creamos un mock para las funciones del programa que se van a llamar
    const sendPostRpcMock = vi.fn().mockResolvedValue('mock_transaction_signature');
    const fetchPostAccountMock = vi.fn().mockResolvedValue({
      content: 'Post desde la blockchain',
      author: { toBase58: () => 'author_publicKey' },
      hashtag: '#testing',
      url: '',
      like: 0,
      likes: [],
      timeZone: 0,
      year: 24,
      month: 1,
      day: 1,
      hour: 0,
      minutes: 0,
      seconds: 0
    });

    // Configuramos el mock de useWorkspace para que devuelva nuestros objetos falsos
    useWorkspace.mockReturnValue({
      wallet: { value: { publicKey: { toBase58: () => 'author_publicKey' } } },
      program: {
        value: {
          rpc: {
            sendPost: sendPostRpcMock,
          },
          account: {
            post: {
              fetch: fetchPostAccountMock,
            },
          },
        },
      },
    });

    // Obtenemos una instancia del store
    const junoStore = useJunoStore();
    const postDePrueba = { content: 'Hola Vitest!', hashtag: '#testing' };

    // 3. Act (Actuación)
    await junoStore.sendPost(postDePrueba);

    // 4. Assert (Verificación)

    // Verificamos que la función RPC fue llamada
    expect(sendPostRpcMock).toHaveBeenCalled();

    // Verificamos que se intentó obtener la cuenta del post recién creado
    expect(fetchPostAccountMock).toHaveBeenCalled();

    // Verificamos que el estado de `posts` se actualizó correctamente
    expect(junoStore.posts.length).toBe(1);
    expect(junoStore.posts[0].content).toBe('Post desde la blockchain');
  });

  it('la acción editPost funciona correctamente', async () => {
    // Arrange
    const editPostRpcMock = vi.fn().mockResolvedValue('mock_edit_signature');
    
    useWorkspace.mockReturnValue({
      wallet: { value: { publicKey: { toBase58: () => 'author_publicKey' } } },
      program: {
        value: {
          rpc: {
            editPost: editPostRpcMock,
          },
        },
      },
    });

    const junoStore = useJunoStore();
    const postToEdit = { 
      publicKey: { toBase58: () => 'post_public_key' },
      content: 'Contenido editado',
      hashtag: '#edited'
    };

    // Act
    await junoStore.editPost(postToEdit);

    // Assert
    expect(editPostRpcMock).toHaveBeenCalled();
  });

  it('la acción likePost funciona correctamente', async () => {
    // Arrange
    const likePostRpcMock = vi.fn().mockResolvedValue('mock_like_signature');
    
    useWorkspace.mockReturnValue({
      wallet: { value: { publicKey: { toBase58: () => 'author_publicKey' } } },
      program: {
        value: {
          rpc: {
            likePost: likePostRpcMock,
          },
        },
      },
    });

    const junoStore = useJunoStore();
    const postToLike = { 
      publicKey: { toBase58: () => 'post_public_key' }
    };
    const tip = '1000000'; // 0.001 SOL

    // Act
    await junoStore.likePost({ post: postToLike, tip });

    // Assert
    expect(likePostRpcMock).toHaveBeenCalled();
  });

  it('la acción deletePost funciona correctamente', async () => {
    // Arrange
    const deletePostRpcMock = vi.fn().mockResolvedValue('mock_delete_signature');
    
    useWorkspace.mockReturnValue({
      wallet: { value: { publicKey: { toBase58: () => 'author_publicKey' } } },
      program: {
        value: {
          rpc: {
            deletePost: deletePostRpcMock,
          },
        },
      },
    });

    const junoStore = useJunoStore();
    const postToDelete = { 
      publicKey: { toBase58: () => 'post_public_key' }
    };

    // Act
    await junoStore.deletePost(postToDelete);

    // Assert
    expect(deletePostRpcMock).toHaveBeenCalled();
  });
});
