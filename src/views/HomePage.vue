<template>
  <div class="flex flex-col justify-between h-screen">
    <!-- Appbar -->
    <div class="w-full">
      <header
        class="flex items-center justify-between p-4 text-white bg-violet-600"
      >
        <div>
          <span class="text-2xl font-bold">Admin Panel</span>
          <span class="ml-6 text-base font-bold"
            >Welcome {{ useStore.name }}</span
          >
        </div>
        <nav class="flex space-x-4">
          <router-link
            activeClass="text-slate-700 font-bold"
            to="/dashboard"
            v-if="useStore.role == 'admin'"
            class="hover:text-gray-300"
            >Home</router-link
          >
          <router-link
            activeClass="text-slate-700 font-bold"
            to="/manage-doctors"
            class="hover:text-gray-300"
            v-if="useStore.role == 'admin'"
            >Manage Doctors</router-link
          >
          <router-link
            activeClass="text-slate-700 font-bold"
            to="/register"
            class="hover:text-gray-300"
            v-if="useStore.role == 'admin'"
            >Register Doctors</router-link
          >

          <router-link
            v-if="useStore.role == 'doctor'"
            activeClass="text-slate-700 font-bold"
            :to="{ name: 'doctor-ui' }"
            class="hover:text-gray-300"
          >
            Doctor Appointment</router-link
          >
          <router-link
            v-if="useStore.role == 'doctor'"
            activeClass="text-slate-700 font-bold"
            :to="{ name: 'profile' }"
            class="hover:text-gray-300"
          >
            Profile</router-link
          >
          <div class="cursor-pointer" @click="Logout()">LogOut</div>
        </nav>
      </header>
      <RouterView></RouterView>
    </div>

    <div class="py-8"></div>
    <footer class="py-4 text-white bg-slate-700">
      <div class="container flex items-center justify-between mx-auto">
        <div class="flex items-center">
          <div class="flex space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <!-- Right side: Copyright Notice -->
        <p>&copy; 2023 Aran Kaban. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
<script setup>
import { RouterView } from "vue-router";
import DoctorUI from "./DoctorUI.vue";
import { useRouter } from "vue-router";
import { useDoctorStore } from "../stores/doctor";
const useStore = useDoctorStore();
import { auth } from "../firebase";
import { watch } from "vue";

const router = useRouter();
async function Logout() {
  useStore.isLoggedIn = false;
  await auth.signOut();
  // window.localStorage.removeItem("ITOKEN");
  // window.localStorage.removeItem("IUSER");
  // window.localStorage.removeItem("IROLE");

  router.push({ name: "login" });
}

watch(
  () => useStore.isReload,
  () => {
    window.location.reload();
  }
);
</script>

<style scoped>
.active {
  color: rgba(rgb(200, 42, 42), green, blue, alpha);
}
</style>
