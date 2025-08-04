import { ref } from 'vue'
import { useJunoStore } from "@/store/juno";

import { Post } from '../models';
import { FILE_TYPE } from "@/helpers/glob";

export const useSenPost = (textAreaReizable) => {

    const store = useJunoStore();

    const post = ref(new Post());

    const localFile = ref(null);
    const fileSelector = ref();
    const typeFile = ref(FILE_TYPE.NONE);

    const onSendPost = async () => {
        if (!post.value.content)
            return;
        await store.sendPost(post.value);
        post.value = {};
        localFile.value = null;
        typeFile.value = FILE_TYPE.NONE;
        textAreaReizable.value.style.height = "18px";
    }

    const onSelectFile = () => {
        fileSelector.value.click();
    }

    const onSelectedFile = (event) => {
        localFile.value = null;
        const file = event.target.files[0];
        if (!file) {
            typeFile.value = FILE_TYPE.NONE;
            localFile.value = null;
            post.value.data = { base64: "", typeFile: FILE_TYPE.NONE };
            return;
        }
        const fr = new FileReader();
        fr.onload = function (data) {
            localFile.value = null;
            
            const [sourse, base64] = data.target.result
                .toString()
                .split("base64,");

            if (sourse.indexOf("data:image") >= 0) {
                typeFile.value = FILE_TYPE.IMAGE;
            } else if (sourse.indexOf("data:video") >= 0) {
                typeFile.value = FILE_TYPE.VIDEO;
            }

            localFile.value = data.target.result;
            post.value.data = { base64, typeFile: typeFile.value };
        };
        fr.readAsDataURL(file);
    }

    return { post, localFile, fileSelector, typeFile, onSendPost, onSelectFile, onSelectedFile }
}