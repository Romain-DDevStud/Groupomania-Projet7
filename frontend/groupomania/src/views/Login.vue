<template>
  <main>
    <form>
      <div class="container1">
        <span class="msg">{{ msg }}</span>
        <Logo/>
        <p>
          <small>
            Vous n'avez pas encore de compte ?
            <br><router-link class="redirection-signup" to="/signup">Enregistrez-vous !</router-link>
          </small>
        </p>
      </div>
      <div class="container2">
        <div class="form-group">
          <label for="inputEmail">Email </label>
          <input type="text" class="form-control" id="inputEmail" v-model="dataLogin.email"/>
        </div>
        <div class="form-group">
          <label for="inputPassword">Mot de passe </label>
          <input type="password" class="form-control" id="inputPassword" v-model="dataLogin.password"/>
        </div>
        <button @click.prevent="logIn" type="submit" class="btn-connexion">Se connecter</button>
      </div>
    </form>

   <Footer/>
  </main>
</template>

<script>
import axios from 'axios';
import Footer from '@/components/Footer.vue';
import Logo from '@/components/Logo.vue';
export default {
  name: "Login",
  components: {Footer, Logo},
  data() {
    return {
      dataLogin: {
        email: null,
        password: null,
      },
      msg:""
    };
  },
  methods: {
    logIn() {
      if (this.dataLogin.email == null || this.dataLogin.password == null) { 
          this.msg ="ERREUR DE SAISIE"
        } else {
            axios
            .post("http://localhost:3000/api/user/login", this.dataLogin)
            .then(response => {
                console.log(response);
                localStorage.setItem('token', response.data.token)
                document.location.href="http://localhost:8080/post"; 
              })
            .catch(error => console.log(error));
          } 
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
.container2 {
    margin: 30px 0 20px 0;
    padding-bottom: 10px;
}
.form-group {
    padding: 5px 0;
}
small a {
    color: #2c3e50;
    text-decoration: none;
    font-weight: bold;
}
#inputEmail, #inputPassword {
    border-radius: 5px;
    outline: none;
    border: none;
    box-shadow: 1px 1px 1px black;
    margin: 5px;
}
.btn-connexion {
    color: #2c3e50;
    font-size: 1rem;
    margin-top: 15px;
    padding: 10px;
    background: linear-gradient(#FD2D01,#ffd7d7);
    text-decoration: none;
    border: 0px solid;
    border-radius: 5px;
    cursor:pointer;
    box-shadow: 1px 1px 1px black;
}
.btn-connexion:hover {
    transform: scale(1.1);
    background: linear-gradient(#FD2D01, #ffd7d7);
    box-shadow: 1px 1px 1px black;
    transition-duration: .15s;
}
.msg { /*message d'alert qui s'affiche en cas d'erreur de saisie*/
    color: red;
}
</style>