<template>
  <b-modal title="Настройки репозитория" id="repo-settings" centered>
    <div class="form-group d-flex flex-direction-column check-group">
      <div title-2>Расширение файлов</div>
      <div v-for="docType in docTypes" :key="docType.id" class="form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">
          {{ docType.type }}
        </label>
      </div>
    </div>
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button
        variant="primary"
        class="custom-button small mr-3"
        @click="cancel"
      >
        Отмена
      </b-button>
      <b-button @click="ok" variant="primary" class="custom-button">
        Добавить
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SettingsModal extends Vue {
  private docTypes = [
    {
      id: 0,
      type: 'pdf',
    },
    {
      id: 1,
      type: 'doc/docx',
    },
    {
      id: 2,
      type: 'odt',
    },
    {
      id: 3,
      type: 'rtf',
    },
    {
      id: 4,
      type: 'pptx',
    },
    {
      id: 5,
      type: 'txt',
    },
  ]
}
</script>

<style scoped>
.check-group {
  flex-direction: column;
}
</style>
