<template>
  <div class="container mt-4">
    <h2>{{ isEditMode ? "Редактировать вакансию" : "Создать вакансию" }}</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="title" class="form-label">Название</label>
        <input
          type="text"
          id="title"
          class="form-control"
          v-model="job.title"
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Описание</label>
        <textarea
          id="description"
          class="form-control"
          v-model="job.description"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="company" class="form-label">Компания</label>
        <input
          type="text"
          id="company"
          class="form-control"
          v-model="job.company"
          required
        />
      </div>

      <div class="mb-3">
        <label for="salary" class="form-label">Зарплата</label>
        <input
          type="number"
          id="salary"
          class="form-control"
          v-model.number="job.salary"
          required
        />
      </div>

      <div class="mb-3">
        <label for="requirements" class="form-label">Требования (через запятую)</label>
        <input
          type="text"
          id="requirements"
          class="form-control"
          v-model="requirementsInput"
        />
      </div>

      <button type="submit" class="btn btn-primary">
        {{ isEditMode ? "Сохранить изменения" : "Создать вакансию" }}
      </button>
    </form>
  </div>
</template>

<script>
import api from "../services/api";
export default {
  name: "JobForm",
  data() {
    return {
      job: {
        title: "",
        description: "",
        company: "",
        salary: 0,
        requirements: [],
      },
      requirementsInput: "",
      isEditMode: false,
    };
  },
  async created() {
    if (this.$route.params.id) {
      this.isEditMode = true;
      try {
        const response = await api.get(`/jobs/${this.$route.params.id}`);
        this.job = response.data;
        this.requirementsInput = this.job.requirements.join(", ");
      } catch (error) {
        console.error("Ошибка при загрузке вакансии:", error);
      }
    }
  },
  methods: {
    async submitForm() {
      this.job.requirements = this.requirementsInput
        .split(",")
        .map((req) => req.trim());
      try {
        if (this.isEditMode) {
          await api.put(`/jobs/${this.$route.params.id}`, this.job);
          alert("Вакансия успешно обновлена!");
        } else {
          await api.post("/jobs", this.job);
          alert("Вакансия успешно создана!");
        }
        this.$router.push("/jobs");
      } catch (error) {
        console.error("Ошибка при сохранении вакансии:", error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
