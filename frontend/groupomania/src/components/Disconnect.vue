<template>
    <p><button @click.prevent="disconnect" type="submit" class="btn-disconnect">Se déconnecter </button></p>
</template>

<script>
export default {
    name: 'Disconnect',
    methods: { 
        disconnect() {
            localStorage.clear();
            document.location.href="http://localhost:8080/login";
        }
    }
}
</script>

<style>
.btn-disconnect {
    padding: 10px;
    font-size: 1rem;
    background: linear-gradient(#FD2D01,#ffd7d7);
    text-decoration: none;
    color: #2c3e50;
    border: 0px solid;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 1px 1px 1px black;
}
.btn-disconnect:hover {
    transform: scale(1.1);
    background: linear-gradient(#FD2D01, #ffd7d7);
    box-shadow: 1px 1px 1px black;
    transition-duration: .15s;
}
</style>