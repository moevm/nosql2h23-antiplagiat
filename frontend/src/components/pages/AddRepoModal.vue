<template>
  <b-modal title="Добавление репозитория" id="add-repo-modal" @ok="addRepo" centered>
    <div class="form-group">
      <label for="exampleInputEmail1" class="title-2">
        Введите ссылку на репозиторий:
      </label>
      <input
        type="text"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="https://github.com/The_fourth_repo"
        v-model="repoName"
      />
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
import {addRepo} from "@/components/pages/helpers/requests";

@Component({
})
export default class AddRepoModal extends Vue {
  private repoName = ""
  private addRepo() {
    addRepo(this.repoName)
    this.$emit("addRepo")
    this.repoName = ""
  }
}
</script>
