<template>
  <div>
    <!-- Appbar -->

    <!-- Body content -->
    <main class="flex flex-1 p-4">
      <!-- Doctors List Table -->
      <section class="w-3/4 p-4">
        <h2 class="mb-4 text-2xl font-bold">List of Doctors</h2>

        <!-- Doctors Table -->
        <table class="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th class="px-6 py-3 border-b text-start">ID</th>
              <th class="px-6 py-3 border-b text-start">Name</th>
              <th class="px-6 py-3 border-b text-start">Email</th>
              <th class="px-6 py-3 border-b text-start" @click="logout()">
                expertise
              </th>

              <!-- Add more columns as needed -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(doctor, i) in doctors"
              :key="i"
              class="transition-all duration-300 hover:bg-gray-100"
            >
              <td class="px-6 py-4 border-b">{{ i + 1 }}</td>
              <td class="px-6 py-4 border-b">{{ doctor.fullName }}</td>
              <td class="px-6 py-4 border-b">{{ doctor.email }}</td>
              <td class="px-6 py-4 border-b">{{ doctor.expertise }}</td>
              <td @click="myemail = doctor.email" class="px-6 py-4 border-b">
                <button class="btn" onclick="my_modal_5.showModal()">
                  Delete
                </button>

                <!-- Delete button -->
              </td>
              <dialog
                id="my_modal_5"
                class="modal modal-bottom sm:modal-middle"
              >
                <div class="modal-box">
                  <h3 class="text-lg font-bold">
                    are you sure you want remove !
                  </h3>
                  <p class="py-4"></p>

                  <div class="flex justify-between w-full modal-action">
                    <button
                      class="btn bg-violet-400 border-violet-400 hover:bg-violet-600"
                      @click="deleteDoctor(myemail)"
                    >
                      Delete
                    </button>
                    <form method="dialog">
                      <!-- if there is a button in form, it will close the modal -->
                      <button class="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
              <!-- Add more columns as needed -->
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Right Side - Doctor Details and Expertise -->
      <section class="w-1/4 p-4 space-y-4">
        <!-- Doctor Details Card -->
        <!-- <div class="p-4 bg-white rounded-lg shadow-md">
            <h2 class="mb-2 text-xl font-semibold">Doctor Details</h2>
            <div>
              <p><strong>Name:</strong> {{ selectedDoctor.name }}</p>
              <p><strong>Email:</strong> {{ selectedDoctor.email }}</p>
        
              <p><strong>Expertise</strong> {{ selectedDoctor.expertise }}</p>
            </div>
          </div> -->

        <!-- Expertise Card -->
        <div class="p-4 bg-white rounded-lg shadow-md">
          <h2 class="mb-2 text-xl font-semibold">Expertise</h2>
          <div class="flex space-x-2">
            <span class="px-2 py-1 text-white bg-blue-500 rounded">
              Veterinary Specialists</span
            >
            <span class="px-2 py-1 text-white bg-green-500 rounded"
              >Neurology</span
            >
            <span class="px-2 py-1 text-white bg-yellow-500 rounded"
              >Exotic Animal Veterinarians</span
            >
            <!-- Add more expertise as needed -->
          </div>
        </div>

        <!-- Additional Card (Add your own content) -->
        <div class="p-4 bg-white rounded-lg shadow-md">
          <h2 class="mb-2 text-xl font-semibold">Additional Information</h2>
          <p>This is additional information about the doctor.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const myemail = ref("");
// Sample Doctors Data (Replace with your actual data)
import { db } from "../firebase";
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const doctors = ref([]);
onMounted(async () => {
  let Doctors = await getDocs(collection(db, "doctors"));
  Doctors.forEach((d) => {
    doctors.value.push({ ...d.data() });
  });
});

const deleteDoctor = async (email) => {
  try {
    const doctorRef = collection(db, "doctors");
    const q = query(doctorRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doctorDoc) => {
      await deleteDoc(doc(doctorRef, doctorDoc.id));
      console.log(`Deleted doctor with email: ${email}`);
    });

    // Refresh doctors list after deletion
    doctors.value = doctors.value.filter((doctor) => doctor.email !== email);
  } catch (error) {
    console.error("Error deleting doctor:", error.message);
  }
};

// Selected Doctor
const selectedDoctor = ref(doctors.value[0]);

// Pagination
const itemsPerPage = 5;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(doctors.value.length / itemsPerPage)
);

const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return doctors.value.slice(start, end);
});

const changePage = (page) => {
  currentPage.value = page;
};

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
const router = useRouter();
const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    router.push("/login"); // Redirect to the login page after logout
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
