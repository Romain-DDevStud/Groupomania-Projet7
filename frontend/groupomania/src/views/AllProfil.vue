<template>
    <main>
        <div id="hautdepage"></div>
        <div class="container1">
            <nav class="navbar">
                <router-link class="redirection-message" to="/post"><Logo/></router-link>
                <div class="BoutonDisconnect"> <Disconnect/></div>
            </nav>
            <div class ="test"><h1>Team Groupomania 😃</h1>
                <ul id="example-1">
                    <li v-for="item in posts" :key="item.id"> 
                        <span>Pseudo :</span> {{ item.username }}<br>
                        <span>Email :</span> {{ item.email }}<br>
                        <span>Admin :</span> {{ item.isAdmin}}<br>
                        <p v-if="member.isAdmin===true">
                            <button @click.prevent="SupProfile()" type="submit" class="btn-supcompte">Supprimer le compte</button>
                        </p>
                        <p v-if="item.attachementuser" > 
                            <img :src="item.attachementuser" alt="..."  />
                        </p><br>
                    </li> 
                </ul> 
            </div>
        </div>
        <Footer/>
    </main>  
</template>

<script>
import Disconnect from '@/components/Disconnect.vue'; 
import Footer from '@/components/Footer.vue';
import Logo from '@/components/Logo.vue';
import axios from "axios";
   export default {
    name: "AllProfil",
    components :{Disconnect, Footer, Logo},
        data() {
            return{
                posts: [],
                member: []
            }    
        },
        mounted() { // je récupère les données du profil connecté
        axios
        .get("http://localhost:3000/api/user/accounts", {  
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token") //je récupère la clé présent dans le local storage
            }
        })
        .then(response => {
          //console.log('réponse API',response);
          this.posts = response.data    
          
        })
        .catch(error => console.log(error));
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
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
}
.test li { /*liste contenant les contenus, titre...*/
    background-color:#F2F2F2;
    margin: 10px auto 20px;
    border: 2px solid none;
    border-radius: 8px;
    box-shadow: 1px 1px 2px #555;
    list-style: none;
    font-family: Arial, Helvetica, sans-serif;
    width: 60%;
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
#example-1 li {
    padding: 5px;
}

@media (max-width: 767px) {
    main {
        font-size: 0.8rem;
    }
    .navbar {
        justify-content: space-between;
    }
    .navbar ul li {
        padding: 0 5px;
    }
    .container1 img {
        width: 25vw;
        height: 10vh;
        position: static;
    } 
    .container2 img {
        width: 40vw;
        height: 22vh;
        border: 2px solid none;
        border-radius: 20px;
    }
    #example-1, #example-2{
        margin: auto;
        margin-right: auto;
        margin-left: auto;
        padding: 0px;
    }
    .test li {
        width: 95%;
    }
    #btn-sup, .btn-publier, .btn-disconnect, .btn-supcompte {
        font-size: 0.8rem;
    }
    #inputContent, #inputTitle, textarea {
        width: 40%;
    }
}   
</style>