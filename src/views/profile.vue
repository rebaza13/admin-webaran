<script setup>
import { ref, reactive } from "vue";
import { useDoctorStore } from "../stores/doctor"; // Update this path with your actual path
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "vue-router";
const userStore = useDoctorStore();

const doctorDetails = reactive({
  fullName: "",
  startTime: "",
  endTime: "",
});

const updateProfile = async () => {
  const router = useRouter();
  const userId = userStore.userId;

  const doctorDocRef = doc(collection(db, "doctors"), userId);
  const userDocRef = doc(collection(db, "users"), userId);

  const updateDoctor = updateDoc(doctorDocRef, {
    fullName: doctorDetails.fullName,
    startTime: doctorDetails.startTime,
    endTime: doctorDetails.endTime,
  });

  const updateUser = updateDoc(userDocRef, {
    fullName: doctorDetails.fullName, // Update the full name in the users collection as well
  });

  // Perform both updates simultaneously
  await Promise.all([updateDoctor, updateUser]);

  setTimeout(() => {
    router.push({ name: "doctor-ui" });
  }, 1000);
};
</script>

<template>
  <div class="flex items-center justify-center pt-40 overflow-hidden">
    <div class="p-8 bg-white rounded-lg shadow-md w-80">
      <h1 class="mb-4 text-2xl font-bold">Edit Profile</h1>

      <div class="mb-4">
        <label for="fullName" class="block mb-1">Full Name</label>
        <input
          v-model="doctorDetails.fullName"
          id="fullName"
          type="text"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-violet-400"
          placeholder="Enter your name"
        />
      </div>
      <div class="mb-4">
        <label for="startTime" class="block mb-1">Working Time Start</label>
        <input
          v-model="doctorDetails.startTime"
          id="startTime"
          type="time"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-violet-400"
        />
      </div>
      <div class="mb-4">
        <label for="endTime" class="block mb-1">Working Time End</label>
        <input
          v-model="doctorDetails.endTime"
          id="endTime"
          type="time"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-violet-400"
        />
      </div>
      <button
        @click="updateProfile"
        class="w-full py-2 text-white rounded-md bg-violet-600 hover:bg-violet-700"
      >
        Update
      </button>
    </div>
  </div>
</template>
