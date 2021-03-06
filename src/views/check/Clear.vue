<template>
  <div>
    <v-dialog v-model="show" persistent max-width="500">
      <v-card :loading="clearing">
        <form
          @submit.prevent="checkAmount"
          @keydown="error.clear($event.target.name)"
        >
          <v-card-text>
            <v-layout row wrap class="px-5">
              <v-flex xs12>
                <v-text-field
                  v-model="date2"
                  :error-messages="error.get('date')"
                  name="date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  @blur="formatDate(date2)"
                  @dblclick="showCalendar = true"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  v-model="amount"
                  :error-messages="error.get('amount')"
                  name="amount"
                  label="Amount Cleared"
                  prepend-icon="mdi-currency-php"
                  @blur="formatAmount"
                ></v-text-field>
              </v-flex>

              <v-flex xs6>
                <v-text-field
                  :value="check.number"
                  label="Check Number"
                  prepend-icon="mdi-tag-text-outline"
                  hide-details
                  class="mb-3"
                  placeholder=" "
                  disabled
                ></v-text-field>
              </v-flex>

              <v-flex xs6>
                <v-text-field
                  :value="check.amount"
                  label="Amount"
                  prepend-icon="mdi-currency-php"
                  hide-details
                  class="mb-3"
                  disabled
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn
              type="submit"
              small
              color="teal white--text"
              :loading="clearing"
            >
              Clear
            </v-btn>
            <v-btn
              color="deep-orange"
              small
              outlined
              @click="show = false"
              :disabled="clearing"
            >
              Close
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              icon
              small
              @click="showImport"
              :disabled="!importable || clearing"
            >
              <v-icon color="indigo">mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCalendar" width="290px">
      <v-date-picker
        no-title
        v-model="date"
        :max="today"
        @change="showCalendar = false"
      >
      </v-date-picker>
    </v-dialog>

    <v-dialog persistent v-model="showConfirm" width="400px">
      <v-card>
        <v-card-title>Check amount does not matched</v-card-title>
        <v-card-text>Do you want to continue? </v-card-text>
        <v-card-actions>
          <v-btn outlined small color="indigo" @click="clear">
            Continue
          </v-btn>
          <v-btn
            color="deep-orange"
            small
            outlined
            @click="showConfirm = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Helper from './../../helper/Helper'
import moment from 'moment'

export default {
  computed: {
    check() {
      return this.$store.getters['check/check']
    },
    clearing() {
      return this.$store.getters['check/clearing']
    },
    error() {
      return this.$store.getters.error
    },
    show: {
      get() {
        return this.$store.getters['check/showClear']
      },
      set(arg) {
        this.$store.commit('check/showClear', arg)
      }
    },
    importable() {
      return this.$store.getters['auth/user'].actionAccess.includes('imt')
    }
  },
  data: () => ({
    amount: '',
    date: null,
    date2: null,
    showCalendar: false,
    showConfirm: false,
    today: moment().format('Y-MM-DD')
  }),
  methods: {
    checkAmount() {
      if (parseFloat(this.check.amount) === parseFloat(this.amount)) {
        this.clear()
      } else {
        this.showConfirm = true
      }
    },
    clear() {
      this.formatAmount()
      this.showConfirm = false
      this.formatDate(this.date2)
      this.$store.dispatch('check/clear', {
        check: this.check.id,
        date: this.date,
        amount: this.amount
      })
    },
    formatDate(date) {
      this.date = Helper.formatDate(date, 'Y-MM-DD')
      this.date2 = Helper.formatDate(date, 'MM/DD/Y')
    },
    showImport() {
      this.show = false
      this.$store.commit('check/showImportClear', true)
    },
    formatAmount() {
      this.amount = Helper.formatCurrency(this.amount)
    }
  },
  watch: {
    show(arg) {
      if (arg) {
        this.formatDate(Date())
        this.error.reset()
        this.amount = ''
      }
    },
    date(arg) {
      this.formatDate(arg)
    }
  }
}
</script>

<style></style>
