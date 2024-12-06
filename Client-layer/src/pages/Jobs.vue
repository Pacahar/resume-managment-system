<template>
    <div>
      <JobList />
    </div>
  </template>
  
  <script>
  import JobList from '../components/JobList.vue';
  
  export default {
    name: 'Jobs',
    components: {
      JobList,
    },
  };
  </script>
  