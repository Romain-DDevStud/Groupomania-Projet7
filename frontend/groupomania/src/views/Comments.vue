<template>
    <main>
        <form>
            <div id="hautdepage"></div>
            <div class="container1">
                <nav class="navbar">
                    <router-link class="redirection-message" to="/post"><Logo/></router-link>
                    <span>
                        <a href="/post">Revenir au fil d'actualités</a>
                    </span>
                </nav>
            </div>
            <div class="container2">
                <div class = "test">
                    <!--<h2>Fil d'actualité</h2>-->
                    <ul id="example-1">
                        <li>
                            <!--partie création commentaire -->
                            <div class="container3">
                               <!-- comments ------  {{ allComments }} --- -->
                               <ul id="example-2"> 
                                    <li v-for="comment in allComments" :key="comment.id"> 
                                        <i>Commentaire de <strong> {{comment.User.username}} </strong> le {{comment.createdAt.split(' ')[0]}} à {{comment.createdAt.slice(11,16)}} : </i><br>
                                        <div class="contenu" >{{ comment.content }}<br></div>
                                        <p v-if="member.userId==comment.userId || member.isAdmin">
                                            <button @click.prevent="DeleteComment(comment.id, comment.userId)" id="btn-sup" type="submit" class="btn btn-primary">Supprimer le commentaire</button>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </li> 
                    </ul> 
                </div>
            </div>
        </form>
        <Footer/>
    </main>
</template>

<script>
import Logo from '@/components/Logo.vue';
import Footer from '@/components/Footer.vue';
import axios from "axios";
export default {
    name: "Comments",
    components :{Logo,Footer},
    data() {
        return {
            id: this.$route.params.id,
            allComments : {},
            posts: [], // récupération des infos des posts
            member: []
        }
    },
    mounted() { 
        axios // récupération des données du profil connecté
        .get("http://localhost:3000/api/user/account", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            //console.log('réponse API', response);
            this.member = response.data
            //console.log('this.member',this.member)
        })
        .catch(error => console.log(error));
        axios // récupération des messages postés
        .get(`http://localhost:3000/api/post/${this.id}/comments`, {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token") // récupération de la clé présente dans le LS
            }
        })
        .then(response => {
            //console.log(response);
            this.allComments = response.data;
            //console.log('allcoments',this.allComments)
        
        })
        .catch(error => console.log(error));

    },
    methods: {
        getComments(postId) {
            axios
            .get(`http://localhost:3000/api/post/${postId}/comments`, 
            {
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token")
                }
            })
            .then(response => {
                this.allComments[postId] = response.data;
                //console.log("this.allComments", this.allComments);
                //document.location.href="http://localhost:8080/post";
            })
            .catch(error => console.log(error));
        },
        DeleteComment(userId) {
            if (window.confirm("Souhaitez-vous réellement supprimer ce commentaire?")) {
                axios
                .delete(`http://localhost:3000/api/comment/${userId}`, {
                    headers: {
                        Authorization: "Bearer " + window.localStorage.getItem("token")
                    },
                })
                .then(() => {
                    window.location.reload();
                })
                .catch(error => console.log(error));
            }
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
h2 {
    margin: 10px auto;
}
a {
    text-decoration: none;
    color: #2c3e50;
}
.container1 {  /*contient les inputs*/
    background-color:#F2F2F2; 
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 10px;
    padding-bottom: 20px;
}
.container1 img { /*logo principal*/
    width: 250px;
}
.container1 .photoprofil { /*photo profil de la page profil perso*/
    height: 50px;
    width: 50px;
    border-radius: 50px;
}
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
}
.navbar ul {
    list-style-type: none;
    width: 100%;
    justify-content: flex-end;
    display: flex;
    padding: 0 20px;
}
.navbar ul li>a {
    padding: 0 10px;
    color: #2c3e50;
    text-decoration: none;
}
.container2 .photoprofil { /*photo profil de la personne qui poste le message*/
    height: 65px;
    width: 65px;
    border-radius: 50px;
    margin-top: 8px;
}
.cacher { /*je cache le texte du bouton pour WAVE*/
    display: none;
}
span { 
    font-size: 18px;
    color: #2c3e50;
}
.contenu { /*texte des messages*/
    font-size: 18px;
}
.test { /*contient le fil d'actualités et le reste des infos*/
    display: flex;
    flex-direction: column;
    background-color: #FFFAFA;
}
/*.profilsansphoto {}*/
.fa-arrow-circle-up {
    font-size: 30px;
}
.fas-fa-users {
    size: 40px;
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
.test li > p {
    margin: 5px 0;
}
.align-comment {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.align-comment > a {
    cursor: pointer;
    margin: 0 10px;
}
.container3 {
    padding: 10px 0 5px 0;
}
.container3 li {
    margin-top: 5px;
    background-color: white;
}
.container2 img { /*image publié par les utilisateurs */
    width: 350px;
    height: 340px;
    border: 2px solid none;
    border-radius: 20px;
}
small { /*redirection vers la page profil*/
    text-align: center;
    margin: 0 auto;
}
/*.redirection-allprofil {}*/
#inputContent, #inputTitle, textarea {
    border: 2px solid transparent;
    border-radius: 5px;
    outline: none;
    box-shadow: 1px 1px 1px black;
    width: 30%;
    margin: 10px 0;
}
.fa-trash-alt { /*logo corbeille*/
    font-size: 30px;
}
.fa-comment { /*envoie de commentaire*/
    font-size: 30px;
    margin-left: 10px;
    cursor: pointer;
}
#btn-sup {
    margin-bottom: 10px;
}
#btn-sup, .btn-publier {
    padding: 10px;
    margin-top: 15px;
    font-size: 1rem;
    background: linear-gradient(#FD2D01,#ffd7d7);
    text-decoration: none;
    color: #2c3e50;
    border: 0px solid;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 1px 1px 1px black;
}
#btn-sup:hover {
    transform: scale(1.1);
    background: linear-gradient(#FD2D01, #ffd7d7);
    box-shadow: 1px 1px 1px black;
    transition-duration: .15s;
}    
.btn-publier:hover {
    transform: scale(1.1);
    background: linear-gradient(#FD2D01, #ffd7d7);
    box-shadow: 1px 1px 1px black;
    transition-duration: .15s;
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
    #btn-sup, .btn-publier, .btn-disconnect {
        font-size: 0.8rem;
    }
    #inputContent, #inputTitle, textarea {
        width: 40%;
    }
}    
</style>