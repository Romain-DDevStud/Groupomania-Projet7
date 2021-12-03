<template>
    <main>
        <form>
            <div id="hautdepage"></div>
            <div class="container1">
                <img class="logo align-self-end" src='../assets/logo_groupomania.png' alt="Logo Groupomania"/>
                <div class="BoutonDisconect">
                    <Disconect/> 
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
                            </p> <!-- j'affiche l'image uniquement si il y en a une-->
                            <p v-if="member.id==item.userId || member.isAdmin">  
                                <button @click.prevent="DeleMessage(item.id, item.userId)" id="btn-sup" type="submit" class="btn btn-primary">Supprimer</button>
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
