<template>
  <div style="margin: 10vw">
    <h2>Список вакансий</h2>
    <div class="mb-3">
      <router-link to="/jobs/new" class="btn btn-primary">Добавить вакансию</router-link>
    </div>
    <ul v-if="jobs.length" class="list-group">
      <li v-for="job in jobs" :key="job._id" class="list-group-item">
        <h3>{{ job.title }}</h3>
        <p>{{ job.description }}</p>
        <p><strong>Компания:</strong> {{ job.company }}</p>
        <p><strong>Зарплата:</strong> {{ job.salary }}</p>
        <p><strong>Требования:</strong> {{ job.requirements.join(', ') }}</p>
        <div v-if="job.resumes && job.resumes.length" class="mt-2">
          <strong>Привязанные резюме:</strong>
          <ul>
            <li v-for="resume in job.resumes" :key="resume._id">
              <router-link :to="`/resumes/${resume._id}/edit`">{{ resume.name }}</router-link>
            </li>
          </ul>
        </div>
        <div v-else class="mt-2">Нет привязанных резюме</div>
        <div class="mt-2">
          <router-link
            :to="`/jobs/${job._id}/edit`"
            class="btn btn-outline-primary me-2"
          >
            Редактировать
          </router-link>
        </div>
      </li>
    </ul>
    <p v-else>Вакансий пока нет.</p>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "JobList",
  data() {
    return {
      jobs: [],
    };
  },
  async created() {
    try {
      const jobResponse = await api.get("/jobs");
      const jobs = jobResponse.data;

      // Для каждой вакансии получить связанные резюме
      const jobsWithResumes = await Promise.all(
        jobs.map(async (job) => {
          const resumeResponse = await api.get("/resumes", {
            params: { jobId: job._id },
          });
          return { ...job, resumes: resumeResponse.data };
        })
      );

      this.jobs = jobsWithResumes;
    } catch (error) {
      console.error("Ошибка загрузки вакансий:", error);
    }
  },
};
</script>
