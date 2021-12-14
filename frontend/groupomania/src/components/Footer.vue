<template>
     <footer>
    <div class="wrapper">
      <small>&copy; 2021 <strong>Groupomania</strong>, Tous droits réservés</small>
      <nav class="footer-nav">
        <a href="#hautdepage">Haut de la page</a>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style>
footer {
    background: #ffd7d7;
    display: table;
    width: 100%;
    height: 9rem;
    text-align: center;
    font-family: 'Arial', sans-serif;
    font-size: 1rem;
}
.wrapper {
    display: table-cell;
    vertical-align: middle;
}
footer small {
    color: #2c3e50;
    margin-bottom: 1rem;
    display: block;
}
.footer-nav a {
    color: #fd2d01;
    text-decoration: none;
    display: inline-block;
}
.footer-nav a:hover {
    font-weight: bold;
    transition: color .15s ease-in-out;
}
</style>