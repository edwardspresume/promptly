<script>
    import { userSessionStore } from '$globalStores/userSessionStore';

    import Icon from '$globalComponents/Icon.svelte';
</script>

{#if $userSessionStore}
    <form action="/dashboard/logout" method="post">
        <button type="submit">
            <Icon name="logout" />
            <span>Logout</span>
        </button>
    </form>
{:else}
    <a href="/sign-in">
        <Icon name="login" />

        <span>Login</span>
    </a>
{/if}
