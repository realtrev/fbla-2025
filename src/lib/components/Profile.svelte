<script lang="ts">
    import { currentUser } from '$lib/pocketbase';
    import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

    let {
        size = "w-14",
        ...props
    }: {
        size?: string,
        class?: string
    } = $props();
</script>

<img alt="Profile" ondragstart={(e) => {e.preventDefault()}} class={`${size} shadow-lg select-none aspect-square rounded-full ${props.class}`} src={`${PUBLIC_POCKETBASE_URL}api/files/_pb_users_auth_/${$currentUser?.id}/${$currentUser?.avatar}?thumb=100x100`} width={size} />

