<template>
  <div style="margin: 10vw;">
    <h2>Список резюме</h2>
    <button 
      class="btn btn-primary mb-3"
      @click="goToCreateResume"
    >
      Создать новое резюме
    </button>
    <ul v-if="resumes.length" class="list-group">
      <li 
        v-for="resume in resumes" 
        :key="resume._id" 
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <h3>{{ resume.name }}</h3>
          <p><strong>Описание:</strong> {{ resume.description }}</p>
          <p><strong>Email:</strong> {{ resume.email }}</p>
          <p><strong>Телефон:</strong> {{ resume.phone }}</p>
          <p><strong>Навыки:</strong> {{ resume.skills.join(', ') }}</p>
        </div>
        <div>
          <button 
            class="btn btn-outline-primary me-2"
            @click="editResume(resume._id)"
          >
            Редактировать
          </button>
        </div>
      </li>
    </ul>
    <p v-else>Резюме пока нет.</p>
  </div>
</template>

<script>
import api from '../services/api';
import { useRouter } from 'vue-router';

export default {
  name: 'ResumeList',
  data() {
    return {
      resumes: [],
    };
  },
  async created() {
    try {
      const response = await api.get('/resumes');
      this.resumes = response.data;
    } catch (error) {
      console.error('Ошибка загрузки резюме:', error);
    }
  },
  methods: {
    goToCreateResume() {
      this.$router.push('/resumes/new');
    },
    editResume(id) {
      this.$router.push(`/resumes/${id}/edit`);
    },
  },
};
</script>
