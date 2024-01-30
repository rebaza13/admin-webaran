<script setup>
import image from "../assets/images/Admin-Control-Panel.svg";
import { ref, reactive } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import { useVuelidate } from "@vuelidate/core";
import { useRouter } from "vue-router";
const router = useRouter();
import { required, email, minLength } from "@vuelidate/validators";
import { auth, db } from "../firebase";

const state = reactive({
  fullName: "",
  email: "",
  password: "",
  role: "doctor",
  selectedOption: "",
});

const rules = {
  fullName: { required }, // Matches state.fullName
  // Matches state.lastName
  email: { required },

  password: { required },
};
const userRef = collection(db, "doctors"); // Reference to the 'users' collection
const added = ref(false);
async function registerUser() {
  v$.value.$touch();
  if (v$.value.$pending || v$.value.$error) return console.log("false");
  else {
    try {
      added.value = true;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        state.email,
        state.password
      );

      // Create a user document in Firestore after registration in 'doctors' collection
      const doctorDocRef = doc(
        collection(db, "doctors"),
        userCredential.user.uid
      );
      const newDoctorId = doctorDocRef.id;
      await setDoc(doctorDocRef, {
        fullName: state.fullName,
        email: state.email,
        expertise: state.selectedOption,
        role: "doctor",
        startTime: "10:00",
        endTime: "17:00",
        availability: true,
        id: newDoctorId,
        address: "new desnip",
        phone: "0772",
      });

      // Also, create a user document in 'users' collection
      const userDocRef = doc(collection(db, "users"), userCredential.user.uid);
      await setDoc(userDocRef, {
        fullName: state.fullName,
        email: state.email,
        role: "doctor",
      });

      router.push("/");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }
}

const v$ = useVuelidate(rules, state);
</script>

<template>
  <body class="relative min-h-screen bg-violet-100">
    <div
      v-if="added"
      role="alert"
      class="absolute left-0 alert alert-success top-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-current shrink-0"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>new doctor added!</span>
    </div>
    <div class="flex items-center justify-between h-screen p-5">
      <div
        class="flex flex-col items-center justify-center w-1/2 px-4 py-12 bg-white border-2 rounded-lg shadow-lg border-violet-200"
      >
        <h1 class="text-4xl font-bold text-violet-600">Register new Doctor</h1>
        <form class="mt-8" action="#" @submit.prevent="registerUser()">
          <div>
            <input
              v-model="state.fullName"
              type="text"
              class="w-full p-4 mb-4 border rounded-md focus:outline-violet-500"
              placeholder="Full name"
            />
            <div
              class="font-medium text-red-500 text-md font-lato fade-down"
              v-for="error in v$.fullName.$errors"
              :key="error.$uid"
            >
              {{ error.$message }}
            </div>
          </div>

          <div>
            <input
              v-model="state.email"
              type="email"
              class="w-full p-4 mb-4 border rounded-md focus:outline-violet-500"
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
          <div>
            <input
              v-model="state.password"
              type="password"
              class="w-full p-4 mb-4 border rounded-md focus:outline-violet-500"
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

          <select
            v-model="state.selectedOption"
            id="select"
            class="w-full p-4 mb-4 border rounded-md focus:outline-violet-500"
          >
            <option value="" disabled selected>-- Select an option --</option>
            <option value="Food Animal Veterinarians">
              Food Animal Veterinarians
            </option>
            <option value="Exotic Animal Veterinarians">
              Exotic Animal Veterinarians
            </option>
            <option value="Companion Animal Veterinarians">
              Companion Animal Veterinarians
            </option>
            <option value="Veterinary Specialists">
              Veterinary Specialists
            </option>
          </select>
          <div class="flex items-center justify-between"></div>
          <button
            type="submit"
            class="w-full p-4 mt-4 text-white rounded-md bg-violet-500 hover:bg-violet-600"
          >
            Register
          </button>
        </form>
      </div>
      <div class="flex items-center justify-center w-1/2 h-full">
        <img :src="image" alt="Image" />
      </div>
    </div>
  </body>
</template>
