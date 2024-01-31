<template>
  <!-- Body content -->
  <main class="flex w-full h-full p-4">
    <!-- Users List Table -->

    <section class="w-full p-4">
      <h2 class="mb-4 text-2xl font-bold">Users List</h2>

      <!-- Search Bar -->

      <!-- Users Table -->
      <table class="w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="px-6 py-3 border-b text-start">ID</th>
            <th class="px-6 py-3 border-b text-start">Name</th>
            <th class="px-6 py-3 border-b text-start">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="index"
            class="transition-all duration-300 hover:bg-gray-100"
          >
            <td class="px-6 py-4 border-b">{{ index + 1 }}</td>
            <td class="px-6 py-4 border-b">{{ user.fullName }}</td>
            <td class="px-6 py-4 border-b">{{ user.email }}</td>
            <td @click="myemail = user.email" class="px-6 py-4 border-b">
              <button class="btn" @click="deleteUser(myemail)">Delete</button>
            </td>
            <!-- Open the modal using ID.showModal() method -->
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { db } from "../firebase";
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
const myemail = ref("");
const deleteUser = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (userDoc) => {
      await deleteDoc(doc(usersRef, userDoc.id));
      console.log(`Deleted user with email: ${email}`);
    });

    // Refresh users list after deletion
    users.value = users.value.filter((user) => user.email !== email);
  } catch (error) {
    console.error("Error deleting user:", error.message);
  }
};
const users = ref([]);
onMounted(async () => {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);

    querySnapshot.forEach((doc) => {
      users.value.push({ ...doc.data() });
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

// Other code for searchTerm, filteredUsers, totalPages, paginatedUsers, changePage
</script>

<style scoped>
/* Add any custom styles here */
</style>
