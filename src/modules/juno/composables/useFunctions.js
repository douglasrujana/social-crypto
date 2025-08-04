import { ref } from 'vue'

import { useWorkspace } from "@/modules/juno/composables";

export const useFunctions = () => {
    const tip = ref(1)
    const tipRef = 10000

    const textAreaReizable = ref()
    const { isMyWallet } = useWorkspace()

    const onResize = () => {
        textAreaReizable.value.style.height = "18px"
        textAreaReizable.value.style.height =
            textAreaReizable.value.scrollHeight + "px"
    }

    const onCalculateTip = () => {
        return tip.value / tipRef;
    };

    const onCheckMyPost = (post) => {
        return isMyWallet(post.author.toBase58());
    };

    return { tip, tipRef, textAreaReizable, onResize, onCalculateTip, onCheckMyPost }
}