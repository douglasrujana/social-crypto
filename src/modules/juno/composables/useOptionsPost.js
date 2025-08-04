import { useJunoStore } from "@/store/juno";

export const useOptionsPost = (post) => {
    const store = useJunoStore();

    const onLikePost = async (tip) => {
        await store.likePost({
            post: post,
            tip: tip,
        });
    };

    const onDeletePost = async () => {
        await store.deletePost(post);
    };

    return { onLikePost, onDeletePost }
}