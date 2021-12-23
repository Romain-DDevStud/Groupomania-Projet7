<template>
    <main>
        <div id="hautdepage"></div>
        <div class="container1">
            <nav class="navbar">
                <router-link class="redirection-message" to="/post"><Logo/></router-link>
                <div class="BoutonDisconnect"> <Disconnect/> </div>
            </nav>
            <h1>Votre profil utilisateur :</h1>
            <span> Pseudo :</span> {{ posts.username }}<br>
            <span> Email :</span> {{ posts.email }}<br>
            <span> Numéro d'identifiant :</span> {{ posts.id }} <br>
            <p v-if="posts.attachementuser"> <img class="photoprofil" :src="posts.attachementuser" alt="..."  /></p><br>
            <p v-if="posts.isAdmin==true" ><span> Profil administrateur :</span> {{ posts.isAdmin }} <br></p>
            <!-- le profil administrateur ne s'affiche que si la personne connectée est admin -->
            <p>  <button @click.prevent="SupProfile" type="submit" class="btn-supcompte">Supprimer le compte</button> </p>
        </div>
        <Footer/>    
    </main>
</template>

<script>
import Disconnect from '@/components/Disconnect.vue'; // appel de la fonction déconnexion
import Footer from '@/components/Footer.vue';
import Logo from '@/components/Logo.vue';
import axios from "axios";
export default {
    name: "PageProfil",
    components :{Disconnect, Footer, Logo},
    data() {
        return{
        posts: [] 
        }    
    },
    mounted() { // je récupère les données du profil connecté
        axios
        .get("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            console.log('réponse API',response);
            this.posts = response.data  
        })
        .catch(error => console.log(error));
    },
    methods:{
        SupProfile() { // permet de supprimer un profil au click
            if (window.confirm("Voulez-vous vraiment supprimer votre compte ?"))
            axios
            .delete("http://localhost:3000/api/auth/delete", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            .then(() => {
                localStorage.clear();
                document. location. href="http://localhost:8080/signup";
            })
        }
    }   
};
</script>

<style>
body {
    max-width: 1600px;
    margin: 0 auto;
}
main {
    width: 100%;
    background-color: white;
    margin: 0 auto;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
}
span {
    font-weight: bold;
}
.photoprofil {
    height: 200px;
    width: 200px;
}
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
}
.container1 {  /*contient les inputs*/
    background-color:#F2F2F2; /*rgba(255,192,203,0.5);*/
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 10px;
    padding-bottom: 20px;
}
.container1 img { /*logo principal*/
    width: 250px;
}
.btn-supcompte {
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
.btn-supcompte:hover {
    transform: scale(1.1);
    background: linear-gradient(#FD2D01,#ffd7d7);
    box-shadow: 1px 1px 1px black;
    transition-duration: .15s;
}

@media (max-width: 767px) {
    .redirection-message{
        position: static;
    }
}
</style>