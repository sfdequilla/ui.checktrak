<template>
  <v-card outlined class="ct-check-index">
    <filter-menu></filter-menu>

    <v-card-text class="pt-0">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="checks"
        :loading="loading"
        :options.sync="pagination"
        :footer-props="{ itemsPerPageOptions: [10, 100, 500] }"
        :server-items-length="totalItems"
        :show-select="selecting"
      >
        <template v-slot:item.account_id="{ item }">
          {{ item.account.code }}
        </template>
        <template v-slot:item.payee_id="{ item }">
          {{ item.payee.name }}
        </template>
        <template v-slot:item.amount="{ item }">
          {{
            Number(item.amount).toLocaleString('en', {
              style: 'currency',
              currency: 'Php'
            })
          }}
        </template>
        <template v-slot:item.status_id="{ item }">
          <v-chip
            x-small
            :text-color="item.received ? 'white' : 'black'"
            :outlined="!item.received"
            :class="item.status.color"
            >{{ item.status.name }}</v-chip
          >
        </template>
        <template v-slot:item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template v-slot:item.updated_at="{ item }">
          {{ formatUpdate(item.updated_at) }}
        </template>

        <template
          v-if="checks && checks.length && !selecting"
          v-slot:body="{ items }"
        >
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              :class="item.status.color + ' lighten-5'"
              @click="showCheck(item.id)"
              style="cursor: pointer;"
            >
              <td>{{ item.account.code }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ item.number }}</td>
              <td>{{ item.payee.name }}</td>
              <td class="text-right">
                {{
                  Number(item.amount).toLocaleString('en', {
                    style: 'currency',
                    currency: 'Php'
                  })
                }}
              </td>
              <td class="text-center">{{ item.details }}</td>
              <td class="text-center">{{ formatUpdate(item.updated_at) }}</td>
              <td class="text-center">
                <v-chip
                  x-small
                  :text-color="item.received ? 'white' : 'black'"
                  :outlined="!item.received"
                  :class="item.status.color"
                  >{{ item.status.name }}</v-chip
                >
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card-text>

    <v-btn
      color="dark darken-4"
      dark
      large
      class="filter-toggle"
      rounded
      elevation="24"
      @click="showFilter"
    >
      <v-icon color="lighten-4 ct-check-masterlist-filter-icon">
        mdi-table-search
      </v-icon>
      <v-spacer></v-spacer>
    </v-btn>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  components: {
    filterMenu: () => import('./Filter.vue')
  },
  computed: {
    checks() {
      return this.$store.getters['check/checks'].data
    },
    filterType() {
      return this.$store.getters['check/filter']
    },
    filterContent() {
      return this.$store.getters['check/filterContent']
    },
    loading() {
      return this.$store.getters['check/loading']
    },
    selecting() {
      return this.$store.getters['check/selecting']
    },
    selected: {
      get() {
        return this.$store.getters['check/selectedChecks']
      },
      set(arg) {
        this.$store.commit('check/selectedChecks', arg)
      }
    },
    pagination: {
      get() {
        return this.$store.getters['check/pagination']
      },
      set(arg) {
        this.$store.commit('check/pagination', arg)
      }
    },
    totalItems() {
      return this.$store.getters['check/checks'].total
    }
  },
  data: () => ({
    headers: [
      { text: 'Account', align: 'left', value: 'account_id', width: '10%' },
      { text: 'Posted', align: 'left', value: 'date', width: '10%' },
      { text: 'Check #', align: 'left', value: 'number', width: '10%' },
      { text: 'Payee Name', align: 'left', value: 'payee_id', width: '16%' },
      { text: 'Amount', align: 'right', value: 'amount', width: '12%' },
      { text: 'Details', align: 'center', value: 'details', width: '18%' },
      {
        text: 'Last Update',
        align: 'center',
        value: 'updated_at',
        width: '12%'
      },
      { text: 'Status', align: 'center', value: 'status_id', width: '12%' }
    ]
  }),
  created() {
    this.debouncedGetChecks = this._.debounce(this.getChecks, 500)
  },
  methods: {
    getChecks() {
      const options = Object.assign(this.pagination, {
        filter: this.filterContent
      })

      this.$store.dispatch('check/getChecks', options)
    },
    formatUpdate(arg) {
      if (Date.parse(arg)) {
        const date = moment(new Date(arg))

        if (moment().diff(date, 'years') > 1) {
          return date.format('MM/DD/Y')
        } else {
          return date.format('MM/DD HH:mm')
        }
      }
    },
    formatDate(arg) {
      if (Date.parse(arg)) {
        return moment(new Date(arg)).format('MM/DD/Y')
      }
    },
    showFilter() {
      this.$store.commit('filter', true)
    },
    truncate(str, num) {
      if (str.length <= num) {
        return str
      }
      return str.slice(0, num - 3) + '...'
    },
    async showCheck(id) {
      if (this.loading) return

      this.$store.commit('check/loading', true)
      await this.$store.dispatch('tools/getStatus')
      this.$store.dispatch('check/showCheck', id)
    }
  },
  mounted() {
    this.pagination = {
      groupBy: [],
      groupDesc: [],
      itemsPerPage: 10,
      multiSort: false,
      mustSort: false,
      page: 1,
      sortBy: [],
      sortDesc: []
    }
  },
  watch: {
    filterContent: {
      deep: true,
      handler() {
        this.debouncedGetChecks()
      }
    },
    pagination: {
      deep: true,
      handler() {
        this.debouncedGetChecks()
      }
    },
    selecting() {
      this.selected = []
    }
  }
}
</script>

<style>
.filter-toggle {
  width: 100px;
  position: fixed;
  right: -48px;
  top: 126px;
  transition: all 0.3s ease;
}
.filter-toggle:hover {
  right: -33px;
}
</style>
