<template>
    <main>
        <form>
            <div id="hautdepage"></div>
            <div class="container1">
                <img class="logo align-self-end" src='../assets/logo_groupomania.png' alt="Logo Groupomania"/>
                <div class="BoutonDisconnect">
                    <Disconnect/> 
                </div>
                <p>
                    <small> Bienvenue {{ member.username }} 😃
                        <router-link class="redirection-profil" to="/profil">
                            <p v-if="member.attachementuser">
                                <img class="photoprofil" :src="member.attachementuser" alt="..."/>
                            </p>
                            <p class="profilsansphoto" v-else>Mon Profil </p>
                        </router-link>
                    </small>
                    <router-link class="redirection-allprofil" to="/allprofil">Membres</router-link>
                </p>
                <div class="form-group">
                    <label for="inputTitle">Titre</label><br>
                    <input type="text" class="form-control" id="inputTitle" v-model="dataMessage.title"/>
                </div>
                <div class="form-group">
                    <label for="inputContent">Exprimez-vous</label><br>
                    <textarea id="inputContent" v-model="dataMessage.content" style="height:100px"></textarea>
                </div>
                <label for="inputFile"></label>
                <div class="btn-upload"> 
                    <input name="inputFile" type="file" class="upload" id="inputFile" @change="onFileChanged"/>
                </div>
                <button @click.prevent="SendMessage" type="submit" class="btn-publier">Publier</button>
            </div>
            <div class="container2">
                <div class = "test">
                    <h1>Fil d'actualité</h1>
                    <ul id="example-1">
                        <li v-for="item in posts" :key="item.id"> 
                            <span>{{ item.title }}<br></span>
                            <p v-if="item.User.attachementuser">
                                <img class="photoprofil" :src="item.User.attachementuser" alt="..."/><br>
                            </p>
                            <i>Publié par <strong>{{ item.User.username }}</strong> le {{item.createdAt.split('T')[0]}} à {{item.createdAt.slice(11,16)}}<br><br></i>
                            <div class="contenu"> {{ item.content }} <br></div>
                            <!-- Id du posteur : {{ item.userId }} -->
                            <p v-if="item.attachement">
                                <img :src="item.attachement" alt="..."/>
                            </p> <!-- affichage de l'image uniquement si il y en a une-->
                            <p v-if="member.id==item.userId || member.isAdmin">  
                                <button @click.prevent="DeleteMessage(item.id, item.userId)" id="btn-sup" type="submit" class="btn btn-primary">Supprimer</button>
                            </p>    
                            <!--le bouton Supprimer s'affiche uniquement si la personne connectée est la personne qui a publié le message ou un admin-->
                            <!--partie création commentaire -->
                            <textarea type="text" id="comment" name="comment" class="form-control"  v-model="dataComment.content" placeholder="Insérez votre commentaire..."></textarea>
                            <a v-on:click="createComment(item.id)">Commenter</a>
                            <div class="container3">
                                <ul id="example-2"> <!--partie affichage commentaire -->
                                    <li v-for="comment in item.Comments" :key="comment.id"> 
                                        <i><strong>{{ comment.User.username }}</strong> le {{comment.createdAt.split('T')[0]}} à {{comment.createdAt.slice(11,16)}}</i><br>
                                        {{ comment.content }}<br>
                                        <p v-if="member.id==comment.userId || member.isAdmin">
                                            <button @click.prevent="DeleteComment(comment.id, comment.userId)" id="btn-sup" type="submit" class="btn btn-primary"></button>
                                        </p>
                                    </li><!--le bouton Supprimer s'affiche uniquement si la personne connectée est la personne qui a publié le commentaire ou un admin-->
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
                selectedFile: null
            },
            dataComment: {
                content: null
            },
            posts: [], // récupération des infos des posts
            member: [] // récupération des infos du user connecté
        }
    },
    mounted() { 
        axios // récupération des données du profil connecté
        .get("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: "Bearer" + localStorage.getItem("token")
            }
        })
        .then(response => {
            console.log('réponse API', response);
            this.member = response.data
        })
        .catch(error => console.log(error));
        axios // récupération des messages postés
        .get("http://localhost:3000/api/post", {
            headers: {
                Authorization: "Bearer" + window.localStorage.getItem("token") // récupération de la clé présente dans le LS
            }
        })
        .then(response => {
            console.log(response);
            this.posts = response.data
        })
        .catch(error => console.log(error));
    },
    methods: {
        SendMessage() { // récupération et envoi des données nécessaires à la création d'un post
            const formData = new FormData();
            formData.append('title', this.dataMessage.title); // .append crée une clé de valeur avec les inputs entrés
            formData.append('content', this.dataMessage.content);
            formData.append('inputFile', this.dataMessage.selectedFile);
            if (formData.get("title") !== null && formData.get("content") !== null) { // .get permet de renvoyer la valeur de la clé de .append créée précédemment
                axios
                .post("http://localhost:3000/api/post", formData, { // récupération des éléments pour le post
                    headers: {
                        Authorization: "Bearer" + window.localStorage.getItem("token")
                    }
                })
                .then(response => {
                    console.log(response);
                    document.location.href="http://localhost:8080/post"; // tout est ok refresh de la page et affichage du post
                })
                .catch(error => console.log(error));
            } else {
                console.log("oops !")
            }
        },
        onFileChanged(event) { // permet de charger un fichier (image) au clic
            this.dataMessage.selectedFile = event.target.files[0];
            console.log(this.dataMessage.selectedFile)
        },
        DeleteMessage(id, userIdOrder) { // pour supprimer, envoi de l'id du post et du user qui l'a créé
            if (window.confirm("Souhaitez-vous réellement supprimer ce post?"))
            axios
            .delete("http://localhost:3000/api/post/"+id,{data:{userIdOrder},
                headers: {
                    Authorization: "Bearer" + window.localStorage.getItem("token")
                },
            })
            .then(() => {
                window.location.reload();
            })
            .catch(error => console.log(error));
        },
        createComment(messageId) {
            if (this.dataComment.comment !== null) {
                axios
                .post("http://localhost:3000/api/post/comment", {
                    content: this.dataComment.content,
                    messageId: messageId
                },
                {
                    headers: {
                        Authorization: "Bearer" + window.localStorage.getItem("token")
                    }
                })
                .then(response => {
                    console.log(response);
                    document.location.href="http://localhost:8080/post";
                })
                .catch(error => console.log(error));
            }
        },
        DeleteComment(id, userIdOrder) {
            if (window.confirm("Souhaitez-vous réellement supprimer ce commentaire?")) {
                axios
                .delete("http://localhost:3000/api/post/comment"+id,{data:{userIdOrder},
                    headers: {
                        Authorization: "Bearer" + window.localStorage.getItem("token")
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


