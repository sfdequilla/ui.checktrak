<template>
  <v-card class="elevation-25" :loading="loading">
    <v-toolbar dark flat color="black" height="50">
      <v-toolbar-title>Reset Password</v-toolbar-title>
    </v-toolbar>
    <form @submit.prevent="send" @keydown="error.clear($event.target.name)">
      <v-divider></v-divider>
      <v-card-text>
        <v-layout row wrap class="mx-5">
          <v-flex xs12>
            <v-text-field
              type="email"
              name="email"
              label="Email"
              prepend-icon="mdi-account-card-details-outline"
              v-model="credential.email"
              :error-messages="error.get('email')"
              autofocus
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text type="submit" color="primary" :loading="loading">
          Send Password Reset
        </v-btn>
        <v-btn
          text
          color="warning"
          :disabled="loading"
          router
          :to="{ name: 'login' }"
        >
          Go to Login
        </v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.getters['auth/loading']
    },
    error() {
      return this.$store.getters.error
    }
  },
  data: () => ({
    credential: {}
  }),
  methods: {
    send() {
      this.$store.dispatch('auth/sendResetPassword', this.credential)
    }
  }
}
</script>

<style></style>
