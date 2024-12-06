<template>
    <div style="margin: 10vw;">
      <h2>{{ isEditMode ? 'Редактирование резюме' : 'Создание резюме' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="name" class="form-label">Имя</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Описание</label>
          <input
            type="text"
            id="description"
            v-model="form.description"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Телефон</label>
          <input
            type="text"
            id="phone"
            v-model="form.phone"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="skills" class="form-label">Навыки</label>
          <input
            type="text"
            id="skills"
            v-model="form.skills"
            class="form-control"
            placeholder="Введите навыки через запятую"
          />
        </div>
        <div class="mb-3">
          <label for="job" class="form-label">Вакансия</label>
          <select
            id="job"
            v-model="form.jobId"
            class="form-select"
          >
            <option value="">Выберите вакансию</option>
            <option v-for="job in jobs" :key="job._id" :value="job._id">
              {{ job.title }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">
          {{ isEditMode ? 'Сохранить изменения' : 'Создать' }}
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import api from "../services/api";
  
  export default {
    name: "ResumeForm",
    data() {
      return {
        form: {
          name: "",
          description: "",
          email: "",
          phone: "",
          skills: "",
          jobId: "", // Добавлено поле для вакансии
        },
        isEditMode: false,
        jobs: [], // Хранение списка вакансий
      };
    },
    async created() {
      await this.fetchJobs(); // Загружаем список вакансий
      const resumeId = this.$route.params.id; // Получаем ID из параметров маршрута
      if (resumeId) {
        this.isEditMode = true;
        await this.fetchResume(resumeId); // Загружаем данные для редактирования
      }
    },
    methods: {
      async fetchResume(id) {
        try {
          const response = await api.get(`/resumes/${id}`);
          const { name, description, email, phone, skills, jobId } = response.data;
          this.form.name = name;
          this.form.description = description;
          this.form.email = email;
          this.form.phone = phone;
          this.form.skills = skills.join(", "); // Преобразуем массив навыков в строку
          this.form.jobId = jobId || ""; // Устанавливаем ID вакансии
        } catch (error) {
          console.error("Ошибка при загрузке резюме:", error);
        }
      },
      async fetchJobs() {
        try {
          const response = await api.get("/jobs");
          this.jobs = response.data;
        } catch (error) {
          console.error("Ошибка при загрузке вакансий:", error);
        }
      },
      async handleSubmit() {
        try {
          const payload = {
            ...this.form,
            skills: this.form.skills.split(",").map((skill) => skill.trim()),
          };
  
          if (this.isEditMode) {
            await api.put(`/resumes/${this.$route.params.id}`, payload);
            alert("Резюме обновлено!");
          } else {
            await api.post("/resumes", payload);
            alert("Резюме создано!");
          }
          this.$router.push("/resumes");
        } catch (error) {
          console.error("Ошибка при сохранении резюме:", error);
          alert("Произошла ошибка при сохранении резюме.");
        }
      },
    },
  };
  </script>
  