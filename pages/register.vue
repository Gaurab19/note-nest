<template>
  <div class="flex bg-black h-screen">
    <!-- sidebar -->
    <div class="bg-zinc-900 w-[516px] p-12 flex flex-col justify-center">
      <Logo/>
      <h1 class="text-white font-bold text-lg mt-8">
        Sign up for a free account
      </h1>
      <p class="text-zinc-300 text-sm mt-0.5">
        Already registered?
        <nuxt-link to="/login" class="font-bold text-[#FFAC00] underline"
        >Log in
        </nuxt-link
        >
        to your account
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
          <button
              class="w-full mt-4 bg-[#FFAC00] rounded-full px-4 py-2 text-sm font-bold flex justify-center items-center space-x-2 cursor-pointer"
          >
            <span>Sign Up</span>
            <ArrowRight/>
          </button>
        </div>
        <!-- /sign up button -->
      </form>
    </div>
    <!-- /sidebar -->
    <!-- note introduction -->
    <div class="flex-1 bg-zinc-800 flex items-center justify-center">
      <div class="max-w-lg p-8">
        <h2 class="text-white text-2xl font-bold">Welcome to NoteNest</h2>
        <p class="text-zinc-300 mt-4">
          Create an account to start using our Note's service and unlock all features.
        </p>
      </div>
    </div>
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
      const response = await $fetch('/api/user', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
        },
      }).then((res) => {
        if (res.succeeded) {
          toast.success('User Created Successfully!', {autoClose: 5000});
        }
      });
    } catch (e) {
      // useNuxtApp().$toast.info('Hello World.\n I am <b>Tom</b>', {
      //   autoClose: 5000,
      //   dangerouslyHTMLString: true,
      // });
      toast.error(e.response?._data.message, {autoClose: 5000});
    }
  }
}
</script>