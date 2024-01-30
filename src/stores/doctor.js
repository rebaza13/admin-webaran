import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";

import { auth, db } from "../firebase";

export const useDoctorStore = defineStore("doctorStore", {
  state: () => ({
    role: JSON.parse(localStorage.getItem("IROLE")) || null,
    name: JSON.parse(localStorage.getItem("IUSER")) || null,
    doctor: {},
    userId: JSON.parse(localStorage.getItem("ITOKEN")) || null,
    appointments: [],
    isLoggedIn: false,
    isReload: false,
    routerole: "",
  }),
  getters: {},
  actions: {
    async getAppointments() {
      try {
        const usersCollection = collection(db, "appointments");
        const usersSnapshot = await getDocs(usersCollection);

        const usersData = [];
        usersSnapshot.forEach((doc) => {
          if (doc.data().doctor_id == this.userId) {
            usersData.push({ id: doc.id, ...doc.data() });
          } else console.log(false);
        });
        this.appointments = usersData;
        // Further processing or usage of this.usersData as needed
      } catch (error) {
        console.error("Error getting users data:", error);
      }
    },
    async loginUser(email, password) {
      const userRef = collection(db, "users"); // Reference to the 'users' collection

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // After successful login, you can get user data from Firestore if needed
      const userId = userCredential.user.uid;
      const userDocRef = doc(userRef, userCredential.user.uid);

      window.localStorage.setItem(
        "ITOKEN",
        JSON.stringify(userCredential.user.uid)
      );
      console.log("this is mr doctor id", userCredential.user.uid);
      const userSnapshot = await getDoc(userDocRef);
      console.log(userSnapshot.data(), "snap"); // Logging user data
      // For now, log a message indicating successful login

      window.localStorage.setItem(
        "IROLE",
        JSON.stringify(userSnapshot.data().role)
      );
      window.localStorage.setItem(
        "IUSER",
        JSON.stringify(userSnapshot.data().fullName)
      );
      this.isLoggedIn = true;
      this.goTopage(userSnapshot.data().role);
    },

    goTopage(role) {
      if (role == "admin") {
        const router = useRouter();

        this.router.push("/dashboard");
        console.log(role, "here");
      } else {
        this.router.push("/doctor-ui");
      }
    },
  },
});
