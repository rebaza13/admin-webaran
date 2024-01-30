<template>
  <div class="relative flex flex-col w-full">
    <label
      class="absolute inline-flex items-center cursor-pointer top-5 left-4 me-5"
    >
      <div
        class="w-5 h-5 rounded-full"
        :class="{
          'bg-rose-400': !doctorAvailability,
          'bg-teal-400': doctorAvailability,
        }"
      ></div>
      <span
        v-if="doctorAvailability"
        class="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300"
        >you will be available to paitents</span
      >
      <span
        v-if="!doctorAvailability"
        class="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300"
        >your profile wont be seen by any user</span
      >
    </label>
    <h1 class="p-5 mb-6 text-3xl font-bold text-center text-gray-700">
      Appointment Schedule
    </h1>
    <!-- table -->
    <table class="w-full border border-gray-200">
      <thead>
        <tr class="text-gray-700">
          <th class="px-6 py-3 text-left">No.</th>
          <th class="px-6 py-3 text-left">Pet Type</th>
          <th class="px-6 py-3 text-left">Appointment date</th>
          <th class="px-6 py-3 text-left">Pet Age</th>
          <th class="px-6 py-3 text-left">Description</th>
          <th class="px-6 py-3 text-left">Status</th>
          <th class="px-6 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="useStore.appointments != []"
          class="bg-gray-100 border-b border-gray-200"
          v-for="(item, i) in useStore.appointments"
          :key="i"
        >
          <td class="px-6 py-4">{{ i + 1 }}</td>
          <td class="px-6 py-4">{{ item.pet_type }}</td>
          <td class="px-6 py-4">
            {{ formatTimestamp(item.appointment_date) }}
          </td>
          <td class="px-6 py-4">{{ item.pet_age }}</td>
          <td class="px-6 py-4">{{ item.description }}</td>
          <td class="px-6 py-4">{{ item.status }}</td>
          <td v-if="item.status == 'pending'" class="px-6 py-4">
            <button
              @click="acceptAppointment(item.id)"
              class="px-4 py-2 mr-2 font-bold text-white bg-green-500 rounded hover:bg-orange-600"
            >
              Accept
            </button>
            <button
              @click="rejectAppointment(item.id)"
              class="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600"
            >
              Reject
            </button>
          </td>
          <td v-else-if="item.status == 'accepted'" class="px-6 py-4">
            <button
              class="px-4 py-2 mr-2 font-bold text-white bg-green-500 rounded hover:bg-orange-600"
            >
              Accepted
            </button>
          </td>
          <td v-else-if="item.status == 'rejected'" class="px-6 py-4">
            <button
              class="px-4 py-2 mr-2 font-bold text-white rounded bg-rose-500"
            >
              Rejected
            </button>
          </td>
        </tr>
        <tr v-else>
          <td colspan="7">NO Appointment Available</td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-10">
      <div class="flex flex-col items-center p-4 rounded-md shadow-lg">
        <p class="pb-4 font-semibold">Setting Availability Work</p>
        <div class="flex gap-6">
          <button
            @click="updateAvailability(useStore.userId, true)"
            class="px-4 py-2 mt-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Available
          </button>
          <button
            @click="updateAvailability(useStore.userId, false)"
            class="px-4 py-2 mt-2 font-bold text-white rounded bg-rose-500 hover:bg-rose-600"
          >
            Not available
          </button>
        </div>
        <p class="pt-2 text-gray-600">
          note user will see your availability based on your action!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useDoctorStore } from "../stores/doctor";
import { useRouter } from "vue-router";
const router = useRouter();
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const doctorAvailability = ref(false); // Default value

const useStore = useDoctorStore();

onMounted(async () => {
  if (useStore.role == "doctor") {
    await useStore.getAppointments();
    const doctorId = useStore.userId;
    const doctorDocRef = doc(db, "doctors", doctorId);
    const doctorDoc = await getDoc(doctorDocRef);
    doctorAvailability.value = doctorDoc.data().availability || false;
  } else {
    router.push({ name: "dashboard" });
  }
});
function formatTimestamp(timestamp) {
  let date;

  if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else if (
    timestamp &&
    typeof timestamp.seconds === "number" &&
    typeof timestamp.nanoseconds === "number"
  ) {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
    date = new Date(milliseconds);
  } else {
    return "Invalid timestamp";
  }

  if (!Number.isFinite(date.getTime())) {
    return "Invalid timestamp";
  }

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    timeZoneName: "short",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

const acceptAppointment = async (appointmentId) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, {
      status: "accepted",
    });
    useStore.getAppointments(); // Refresh appointments after update
  } catch (error) {
    console.error("Error accepting appointment:", error);
  }
};

const rejectAppointment = async (appointmentId) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, {
      status: "rejected",
    });
    useStore.getAppointments(); // Refresh appointments after update
  } catch (error) {
    console.error("Error rejecting appointment:", error);
  }
};

const updateAvailability = async (doctorId, availability) => {
  try {
    const doctorRef = doc(db, "doctors", doctorId);
    await updateDoc(doctorRef, {
      availability: availability,
    });
    // Optionally, refresh appointments after updating availability
    useStore.getAppointments();
  } catch (error) {
    console.error("Error updating availability:", error);
  }
};
</script>
