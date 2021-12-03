<template>
  <main>
    <form>
      <div class="container1">
        <span class="msg">{{ msg }}</span>
        <Logo/>
        <p>
          <small>
            Vous avez déjà un compte ?
            <br><router-link class="redirection-singup" to="/login">Connectez-vous !</router-link>
          </small>
        </p>
      </div>
      <div class="container2">
        <div class="form-group">
          <label for="inputUsername">Nom </label>
          <input type="text" class="form-control" id="inputUsername" v-model="dataSignup.username"/>
        </div>
        <div class="form-group">
          <label for="inputEmail">Email </label>
          <input type="email" class="form-control" id="inputEmail" v-model="dataSignup.email"/>
        </div>
        <div class="form-group">
          <label for="inputPassword">Mot de passe </label>
          <input type="password" class="form-control" id="inputPassword" v-model="dataSignup.password"/>
        </div>
        <div class="btn-upload"> 
            <label for="inputFile">Ajouter une photo de profil</label><br>
            <input name="inputFile" type="file" class="upload" id="inputFile" @change="onFileChanged"/>
        </div>
        <button @click.prevent="sendSignup" type="submit" class="btn-signup">S'enregistrer</button>
      </div>
    </form>
    <Footer/>
  </main>
</template>

<script>
import axios from "axios";
import Footer from '@/components/Footer.vue';
import Logo from '@/components/Logo.vue';
export default {
  name: "SignUp",
  components: {Footer, Logo},
  data() {
    return {
      dataSignup: { //on initialise les éléments suivants qui sont vides pour le moment et seront "remplis" grâce à v-model
        username: "",
        email: "",
        password: "",
        selectedFile: ""
      },
      msg:""
    };
  },
  methods: {
    sendSignup() {
      const formData = new FormData();
      formData.append('username', this.dataSignup.username);
      formData.append('email', this.dataSignup.email);
      formData.append('password', this.dataSignup.password);
      formData.append('inputFile', this.dataSignup.selectedFile);
      if (!formData.get("email") || !formData.get("username") || !formData.get("password")) { 
        this.msg ="ERREUR DE SAISIE"
      } else { 
        axios
          .post("http://localhost:3000/api/user/new", formData)
          .then(response => {
            console.log(response); //une fois le compte enregistré on remet les inputs "à 0"
            //Réinitialisation
            this.dataSignup.email = null;
            this.dataSignup.username = null;
            this.dataSignup.password = null;
            document. location. href="http://localhost:8080/login";
          })
          .catch(error => console.log(error));
      }
    },
    onFileChanged (event) { //me permet de charger un fichier (une image) au click
      this.dataSignup.selectedFile = event.target.files[0];
        console.log(this.dataSignup.selectedFile)
    }
  }
};
</script>

<style>
main {
    width: 100%;
    background-color: white;
    margin: 0 auto;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
}
form {
    margin: 50px 0;
}
.form-group {
    padding: 5px 0;
}
small a {
    color: #2c3e50;
    text-decoration: none;
    font-weight: bold;
}
.cacher { 
    display: none;
}
.btn-signup{
  padding: 10px;
  margin-top: 15px;
  font-size: 1rem;
  background: linear-gradient(#FD2D01,#ffd7d7);
  text-decoration: none;
  color: #2c3e50;
  border: 0px solid;
  border-radius: 5px;
  cursor:pointer;
  box-shadow: 1px 1px 1px black;
}
.btn-signup:hover {
  scale: 1.1;
  background: linear-gradient(#FD2D01, #ffd7d7);
  box-shadow: 1px 1px 1px black;
  transition-duration: .15s;
}
#inputEmail, #inputPassword, #inputUsername {
  border-radius: 5px;
  border: none;
  outline: none;
  box-shadow: 1px 1px 1px black;
  margin: 5px;
}
.msg{ /*message d'alert qui s'affiche en cas d'erreur de saisie*/
  color: red;
}
</style>