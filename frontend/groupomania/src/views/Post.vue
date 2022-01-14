<template>
    <main>
        <form>
            <div id="hautdepage"></div>
            <div class="container1">
                <nav class="navbar">
                    <img class="logo align-self-end" src="../assets/logo_groupomania2.png" alt="Logo Groupomania"/>
                    <ul>
                        <li>
                            <router-link class="redirection-profil" to="/profil">Profil
                                <p v-if="member.attachementuser">
                                    <img class="photoprofil" :src="member.attachementuser" alt="..."/>
                                </p>
                            </router-link>
                        </li>
                        <li>    
                            <router-link class="redirection-allprofil" to="/allprofil">Membres</router-link>
                        </li>  
                    </ul>
                    <div class="BoutonDisconnect">
                        <Disconnect/> 
                    </div>
                </nav>
                <h1> Bienvenue {{ member.username }} ! </h1>
                <div class="form-group">
                    <label for="inputContent">Exprimez-vous</label><br>
                    <textarea id="inputContent" v-model="dataMessage.content" style="height:75px"></textarea>
                </div>
                <label for="inputFile"></label>
                <div class="btn-upload"> 
                    <input name="inputFile" type="file" class="upload" id="inputFile" @change="onFileChanged"/>
                </div>
                <button @click.prevent="SendMessage" type="submit" id="btn-publier">Publier</button>
            </div>
            <div class="container2">
                <div class = "test">
                    <h2>Fil d'actualité</h2>
                    <ul id="example-1">
                        <li v-for="item in posts" :key="item.id"> 
                            <!-- <span>{{ item.title }}<br></span> -->
                            <p v-if="item.User.attachementuser">
                                <img class="photoprofil" :src="item.User.attachementuser" alt="..."/><br>
                            </p>
                            <i>Publié par <strong>{{ item.User.username }}</strong> le {{item.createdAt.split(' ')[0]}} à {{item.createdAt.slice(11,16)}}<br><br></i>
                            <div class="contenu"> {{ item.content }} <br></div>
                            <!-- Id du posteur : {{ item.userId }} -->
                            <p v-if="item.attachement">
                                <img :src="item.attachement" alt="..."/>
                            </p> <!-- affichage de l'image uniquement si il y en a une-->
                            <p v-if="member.userId==item.userId || member.isAdmin">  
                                <button @click.prevent="DeleteMessage(item.id)" id="btn-sup" type="submit" class="btn btn-primary">Supprimer le post</button>
                            </p>    
                            <!--le bouton Supprimer s'affiche uniquement si la personne connectée est la personne qui a publié le message ou un admin-->
                            <!--partie création commentaire -->
                            <div class="align-comment">
                                <textarea type="text" v-bind:id="item.id" name="comment" class="form-control"  v-model="dataComment[item.id]" placeholder="Insérez votre commentaire..."></textarea>
                                <router-link :to="'/Comments/'+item.id">
                                    <a v-on:click="createComment(item.id)" id="btn-publier">Commenter</a>
                                </router-link>
                            </div>
                            <div class="container3">
                                <div>
                                    <router-link class="comment" :to="'/Comments/' + item.id">Cliquez ici pour voir les commentaires du post</router-link>
                                </div>
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
import Disconnect from '@/components/Disconnect.vue';
import Footer from '@/components/Footer.vue';
import axios from "axios";
export default {
    name: "Message",
    components :{Disconnect, Footer},
    data() {
        return {
            dataMessage: {
                title: null,
                content: null,
                image: null
            },
            selectedFile: null,
            dataComment: {
            },
            allComments : {},
            posts: [], // récupération des infos des posts
            member: [] // récupération des infos du user connecté
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
        .get("http://localhost:3000/api/post", {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token") // récupération de la clé présente dans le LS
            }
        })
        .then(response => {
            //console.log(response);
            this.posts = response.data ;
            this.posts.forEach((post) => {
                this.getComments(post.id);
            })
        })
        .catch(error => console.log(error));

    },
    methods: {
        SendMessage() { // récupération et envoi des données nécessaires à la création d'un post
            const formData = new FormData();
            formData.append('title', this.dataMessage.title); // .append crée une clé de valeur avec les inputs entrés
            formData.append('content', this.dataMessage.content);
            formData.append('image', this.dataMessage.image);
            formData.append('userId', this.member.id);
            if (formData.get("image") !== null && formData.get("content") !== null) { 
                axios
                .post("http://localhost:3000/api/post", formData, { // récupération des éléments pour le post
                    headers: {
                        Authorization: "Bearer " + window.localStorage.getItem("token")
                    }
                })
                .then(response => {
                    console.log(response);
                    document.location.href="http://localhost:8080/post"; // tout est ok refresh de la page et affichage du post
                })
                .catch(error => console.log(error));
            } else {
                console.log("Oops !")
            }
        },
        onFileChanged(event) { // permet de charger un fichier (image) au clic
            this.dataMessage.image = event.target.files[0];
            this.selectedFile = event.target.files[0].name;
            //console.log(this.dataMessage.selectedFile)
        },
        DeleteMessage(id) { // pour supprimer, envoi de l'id du post et du user qui l'a créé
            if (window.confirm("Souhaitez-vous réellement supprimer ce post?"))
            axios
            .delete("http://localhost:3000/api/post/"+ id, {
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token")
                },
            })
            .then(() => {
                window.location.reload();
            })
            .catch(error => console.log(error));
        },
        createComment(postId) {
            if (this.dataComment[postId] !== null) {
                axios
                .post("http://localhost:3000/api/comment", {
                    content: this.dataComment[postId],
                    postId: postId
                },
                {
                    headers: {
                        Authorization: "Bearer " + window.localStorage.getItem("token")
                    }
                })
                .then(response => {
                    console.log(response);
                    //document.location.href="http://localhost:8080/post";
                    this.getComments(postId);
                })
                .catch(error => console.log(error));
            }
        },
        getComments(postId) {
            axios
            .get(`http://localhost:3000/api/post/${postId}/comments`, 
            {
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token")
                }
            })
            .then(response => {
                this.allComments[postId]= response.data ;
                //console.log("this.allComments",this.allComments);
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
    max-width: 100%;
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
.navbar img {
    width: 250px;
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
span { /*titre, contenu... en gras */
    font-weight: bold;
    font-size: 18px;
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
    padding-bottom: 5px;
}
.container3 li {
    margin-top: 5px;
    background-color: white;
}
.container2 img { /*image publié par les utilisateurs */
    max-width: 100%;
    height: 340px;
    border: 2px solid none;
    border-radius: 10px;
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
#btn-sup, #btn-publier {
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
#btn-publier:hover {
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
        justify-content: center;
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
        width: 100%;
    }
    #btn-sup, #btn-publier, .btn-disconnect {
        font-size: 0.8rem;
    }
    #inputContent, #inputTitle, textarea {
        width: 40%;
    }
}    
</style>
