<template>
  <v-dialog v-model="show" persistent max-width="400">
    <v-card :loading="loading">
      <form @submit.prevent="importPayees">
        <v-card-title>
          <span style="font-size: 17.5px">
            Import Payees
          </span>
          <v-spacer></v-spacer>
          <v-btn
            small
            icon
            href="https://sriwebapp.github.io/ui.checktrak/"
            target="_blank"
          >
            <v-icon color="green">mdi-help-circle-outline</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap class="px-5">
            <v-flex xs12>
              <v-file-input
                ref="fileinput"
                v-model="file"
                label="Select File to be Imported"
                show-size
                :error-messages="error.get('payees_file')"
                @change="error.reset()"
                prepend-icon="mdi-file-upload-outline"
                accept=".csv"
              ></v-file-input>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn
            type="submit"
            small
            color="indigo white--text"
            :loading="loading"
            :disabled="!file || loading"
          >
            Start Importing
            <template v-slot:loader>
              <span>Importing...</span>
            </template>
          </v-btn>
          <v-btn
            color="deep-orange"
            small
            outlined
            @click="show = false"
            :disabled="loading"
          >
            Return
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    error() {
      return this.$store.getters.error
    },
    loading() {
      return this.$store.getters['payee/loading']
    },
    show: {
      get() {
        return this.$store.getters['payee/showImportCreate']
      },
      set(arg) {
        this.$store.commit('payee/showImportCreate', arg)
      }
    }
  },
  data: () => ({
    file: null
  }),
  methods: {
    importPayees() {
      this.$store.dispatch('payee/importCreatePayees', this.file)
    }
  },
  watch: {
    show(arg) {
      if (arg) {
        this.error.reset()
        this.file = null
      }
    }
  }
}
</script>

<style></style>
