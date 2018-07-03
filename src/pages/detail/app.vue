<template>
<div>
  <h1>hello detail!</h1>
  <ul>
    <li>
      <router-link to="/">go to one</router-link><br/>
      <router-link to="/two">go to two</router-link>
    </li>
  </ul>
  <router-view/>
</div>

</template>
<script>
export default {

}
</script>

<style>

</style>
