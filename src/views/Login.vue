<script setup>
import image from "../assets/images/undraw_Good_doggy_re_eet7.png";
import { useRouter } from "vue-router";
import { reactive, watch } from "vue";
import { RouterLink } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";
import { useDoctorStore } from "../stores/doctor";
const router = useRouter();
const useStore = useDoctorStore();
const state = reactive({
  email: "",
  password: "",
});

async function loginUser() {
  v$.value.$touch();
  if (v$.value.$pending || v$.value.$error) return console.log("false");
  else {
    await useStore.loginUser(state.email, state.password);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
}

const rules = {
  email: {
    required: helpers.withMessage("Please enter your email", required),
  },
  password: {
    required: helpers.withMessage("Please enter your password", required),
    minLength: minLength(5),
  },
};
watch(
  () => useStore.isRouteActive,
  (val) => {
    if (useStore.isRouteActive == "a") {
      setTimeout(() => {
        console.log("admin or");
        router.push({ name: "dashboard" });
        router.replace({ name: "dashboard" });
      }, 3000);
      router.push({ name: "dashboard" });
      router.replace({ name: "dashboard" });
    } else {
      console.log("here doctor");
      router.push({ name: "doctor-ui" });
      router.replace({ name: "doctor-ui" });
      setTimeout(() => {
        console.log("here doctor");
        router.push({ name: "doctor-ui" });
        router.replace({ name: "doctor-ui" });
      }, 3000);
    }
  }
);
const v$ = useVuelidate(rules, state);
</script>

<template>
  <body class="min-h-screen bg-violet-100">
    <div
      class="flex flex-col items-center h-screen p-5 lg:flex-row lg:justify-between"
    >
      <div
        class="flex flex-col items-center justify-center w-1/2 px-4 py-16 bg-white border border-r-0 rounded-l-md"
      >
        <h1 class="text-4xl font-bold text-violet-600">Login</h1>
        <form @submit.prevent="loginUser" class="mt-8" action="#">
          <div class="flex flex-col w-full">
            <input
              v-model="state.email"
              type="email"
              class="w-full p-4 mb-4 border rounded-md focus:violet-orange-500"
              placeholder="Email"
            />
            <div
              class="font-medium text-red-500 text-md font-lato fade-down"
              v-for="error in v$.email.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </div>
          </div>

          <div class="flex flex-col w-full">
            <input
              v-model="state.password"
              type="password"
              class="w-full p-4 border rounded-md focus:outline-violet-500"
              placeholder="Password"
            />
            <div
              class="font-medium text-red-500 text-md font-lato fade-down"
              v-for="error in v$.password.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </div>
          </div>
          <div class="flex items-center justify-between py-4"></div>
          <button
            class="w-full p-4 mt-4 text-white rounded-md bg-violet-500 hover:bg-violet-600"
          >
            Login
          </button>
        </form>
      </div>
      <div class="w-0.5 h-2/4"></div>
      <div class="flex items-center justify-center w-1/2">
        <img
          class="h-[435px] w-full object-cover rounded-l-0 rounded-r-md border-violet-400"
          :src="image"
          alt="Image"
        />
      </div>
    </div>
  </body>
</template>
