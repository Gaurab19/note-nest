<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- sidebar -->
    <div class="bg-black w-[516px] p-12 flex flex-col justify-center">
      <Logo/>
      <h1 class="text-white font-bold text-lg mt-8">Log in to your account</h1>
      <p class="text-zinc-300 text-sm mt-0.5">
        Don't have an account?
        <nuxt-link to="/register" class="font-bold text-[#FFAC00] underline"
        >Sign Up
        </nuxt-link
        >
        for one.
      </p>

      <form @submit.prevent="submit">
        <div class="mt-8">
          <label for="" class="text-zinc-300 text-sm block mb-0.5"
          >Email Address</label
          >
          <UInput v-model="email" trailing-icon="i-lucide-at-sign" placeholder="you@example.com" size="md"
                  class="w-full text-white text-sm"/>
          <ValidationMessage
          >{{ v$.email?.$errors[0]?.$message }}
          </ValidationMessage>
        </div>

        <div class="mt-6">
          <label for="" class="text-zinc-300 text-sm block mb-0.5"
          >Password</label
          >
          <UInput
              v-model="password"
              placeholder="****************"
              :type="show ? 'text' : 'password'"
              :ui="{ trailing: 'pe-1' }"
              class="w-full text-white text-sm"
          >
            <template #trailing>
              <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="show ? 'Hide password' : 'Show password'"
                  :aria-pressed="show"
                  aria-controls="password"
                  @click="show = !show"
              />
            </template>
          </UInput>
          <ValidationMessage
          >{{ v$.password?.$errors[0]?.$message }}
          </ValidationMessage>
        </div>

        <!-- sign up button -->
        <div>
          <UButton
              trailing-icon="i-lucide-arrow-right"
              class="w-full cursor-pointer mt-4 bg-[#FFAC00] hover:bg-[#FFAC00] rounded-full px-4 py-2 text-sm font-bold flex justify-center items-center space-x-2"
              :loading="loading"
              :disabled="loadg"
              type="submit"
          >
          Sign In
          </UButton>
        </div>
        <!-- /sign up button -->
      </form>
    </div>
    <!-- /sidebar -->
    <!-- note introduction -->
    <div></div>
    <!-- /note introduction -->
  </div>
</template>

<script setup lang="ts">
import {toast} from 'vue3-toastify';
import {useVuelidate} from '@vuelidate/core'
import {helpers, required, minLength, email as emailValidator} from '@vuelidate/validators'
const email = ref('')
const password = ref('')
const show = ref(false)
const loading=ref(false);

const rules = ref({
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Please enter a valid email address', emailValidator),
    $autodirty: true,
  },
  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Password must be at least 8 characters', minLength(8)),
    $autodirty: true,
  }
});
const v$ = useVuelidate(rules, {email, password})

async function submit() {
  v$.value.$validate();
  if (v$.value.$errors.length == 0) {
    try {
      loading.value=true
      const response = await $fetch('/api/login', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
        },
      }).then((res) => {
        if (res.succeeded) {
          loading.value=false
          toast.success('Logged In Successfully!', {multiple:false,autoClose: 1500,onClose: () =>navigateTo('/')});
        }
      });
    } catch (e) {
      // useNuxtApp().$toast.info('Hello World.\n I am <b>Tom</b>', {
      //   autoClose: 5000,
      //   dangerouslyHTMLString: true,
      // });
      loading.value=false;
      toast.error(e.response?._data.message, {autoClose: 5000});
    }
  }
}
</script>