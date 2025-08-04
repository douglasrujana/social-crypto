import { useJunoStore } from "@/store/juno";

export const useEditPost = (post, emit) => {

    const store = useJunoStore();

    const onEditPost = async () => {
        await store.editPost(post.value);
        emit("closeEditing");
    };

    return { onEditPost }
}