<template>
  <v-dialog v-model="show" persistent max-width="800">
    <v-card>
      <div>
        <v-card-title>
          <span style="font-size: 17.5px">
            Failed Checks
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="show = false">
            <v-icon color="error">mdi-close-box</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="checks"
            :footer-props="{ itemsPerPageOptions: [10] }"
            :loading="loading"
            :options.sync="pagination"
          >
          </v-data-table>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    checks() {
      return this.$store.getters['check/failedChecks']
    },
    loading() {
      return this.$store.getters['check/loading']
    },
    show: {
      get() {
        return this.$store.getters['check/showFailedClearCheck']
      },
      set(arg) {
        this.$store.commit('check/showFailedClearCheck', arg)
      }
    }
  },
  data: () => ({
    headers: [
      { text: 'Date', align: 'left', value: 'date' },
      { text: 'Number', align: 'left', value: 'number' },
      { text: 'Amount', align: 'left', value: 'cleared' },
      { text: 'Reason', align: 'left', value: 'reason' }
    ],
    pagination: {}
  }),
  watch: {
    show(arg) {
      if (arg) {
        this.pagination = {}
      }
    }
  }
}
</script>

<style></style>
