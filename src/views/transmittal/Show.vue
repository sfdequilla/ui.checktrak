<template>
  <v-card outlined :loading="loading">
    <v-card-title style="font-size: 17.5px">Transmittal Report</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-layout row wrap class="mb-5">
        <v-flex xs6>
          <v-list-item two-line class="my-n4">
            <v-list-item-content>
              <v-list-item-title>{{ transmittal.ref }}</v-list-item-title>
              <v-list-item-subtitle>Transmittal Reference</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line class="my-n4">
            <v-list-item-content>
              <v-list-item-title>
                {{
                  transmittal.incharge_user
                    ? transmittal.incharge_user.name
                    : ''
                }}
              </v-list-item-title>
              <v-list-item-subtitle>Transmitted to</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line class="my-n4">
            <v-list-item-content>
              <v-list-item-title>
                {{ formatDate(transmittal.date, 'MMM DD, Y') }}
              </v-list-item-title>
              <v-list-item-subtitle>Date Transmitted</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line class="my-n4">
            <v-list-item-content>
              <v-list-item-title>
                {{
                  transmittal.returned
                    ? formatDate(transmittal.returned, 'MMM DD, Y')
                    : ''
                }}
              </v-list-item-title>
              <v-list-item-subtitle>Date Returned</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-flex>
        <v-flex xs6>
          <v-list-item two-line class="my-n4">
            <v-list-item-content class="text-right">
              <v-list-item-title>
                {{ formatDate(transmittal.due, 'MMM DD, Y') }}
              </v-list-item-title>
              <v-list-item-subtitle>Date due for Return</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line class="my-n4">
            <v-list-item-content class="text-right">
              <v-list-item-title>
                {{ transmittal.user ? transmittal.user.name : '' }}
              </v-list-item-title>
              <v-list-item-subtitle>Prepared by</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line class="my-n4">
            <v-list-item-content class="text-right">
              <v-list-item-title>
                {{ transmittal.checks ? transmittal.checks.length : '0' }} pc/s
              </v-list-item-title>
              <v-list-item-subtitle>No. of Checks</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line class="my-n4">
            <v-list-item-content class="text-right">
              <v-list-item-title>
                {{ totalAmount }}
              </v-list-item-title>
              <v-list-item-subtitle>Total Amount</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="transmittal.checks"
        :footer-props="{ itemsPerPageOptions: [10] }"
      >
        <template v-if="transmittal.checks.length" v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              :class="item.status.color + ' lighten-5'"
            >
              <td>{{ formatDate(item.date, 'MM/DD/Y') }}</td>
              <td>{{ item.number }}</td>
              <td>{{ item.payee.name }}</td>
              <td>{{ item.details }}</td>
              <td class="text-right">
                {{
                  Number(item.amount).toLocaleString('en', {
                    style: 'currency',
                    currency: 'Php'
                  })
                }}
              </td>
              <td class="text-center">{{ showClaimedDate(item.history) }}</td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        small
        class="indigo white--text"
        :href="transmittalReport"
        target="_blank"
        :disabled="loading"
      >
        Transmittal Report
      </v-btn>

      <v-btn
        v-if="transmittal.returned"
        small
        class="indigo white--text"
        :href="returnReport"
        target="_blank"
        :disabled="loading"
      >
        Return Report
      </v-btn>

      <v-btn
        class="deep-orange white--text"
        small
        @click="$router.go(-1)"
        :disabled="loading"
      >
        Go Back
      </v-btn>

      <v-spacer></v-spacer>

      <form :action="exportLink" method="post">
        <input type="hidden" name="id" :value="transmittal.id" />

        <v-btn type="submit" icon small :disabled="loading">
          <v-icon color="green darken-3">mdi-file-export-outline</v-icon>
        </v-btn>
      </form>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  computed: {
    loading() {
      return this.$store.getters['transmittal/loading']
    },
    company() {
      return this.$store.getters['tools/company']
    },
    transmittal() {
      return this.$store.getters['transmittal/transmittal']
    },
    totalAmount() {
      let total = this.transmittal.checks
        ? this.transmittal.checks.reduce((total, check) => {
            return total + parseFloat(check.amount)
          }, 0)
        : 0

      return Number(total).toLocaleString('en', {
        style: 'currency',
        currency: 'Php'
      })
    },
    exportLink() {
      return (
        process.env.VUE_APP_API +
        '/' +
        this.company.code +
        '/export/transmittal'
      )
    },
    returnReport() {
      return (
        process.env.VUE_APP_API +
        '/pdf/transmittal/' +
        this.transmittal.ref +
        '-1.pdf'
      )
    },
    transmittalReport() {
      return (
        process.env.VUE_APP_API +
        '/pdf/transmittal/' +
        this.transmittal.ref +
        '.pdf'
      )
    }
  },
  data: () => ({
    headers: [
      { text: 'Posted', align: 'left', value: 'date', width: '12%' },
      { text: 'Check #', align: 'left', value: 'number', width: '12%' },
      { text: 'Payee Name', align: 'left', value: 'payee_id', width: '23%' },
      { text: 'Details', align: 'left', value: 'details', width: '23%' },
      { text: 'Amount', align: 'right', value: 'amount', width: '12%' },
      {
        text: 'Claimed',
        align: 'center',
        value: 'history',
        sortable: false,
        width: '12%'
      }
    ]
  }),
  methods: {
    formatDate(arg, format) {
      if (Date.parse(arg)) {
        return moment(new Date(arg)).format(format)
      }
    },
    showClaimedDate(history) {
      let claimed = history.find(h => h.action_id === 4 && h.active === 1)
      if (!claimed) return
      return moment(new Date(claimed.date)).format('MM/DD/Y')
    }
  },
  mounted() {
    this.$store.dispatch('transmittal/getTransmittal', this.$route.params.id)
  }
}
</script>

<style></style>
