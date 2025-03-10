const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

async function getHistoricoFormas() {
  const database = getDatabase(app);
  const pavimentoRef = ref(database, 'Pavimento');

  try {
    const snapshot = await get(pavimentoRef);
    if (snapshot.exists()) {
      const pavimento = snapshot.val();
      const pavimentos = pavimento.Pavimento;

      Object.keys(pavimentos).forEach((key) => {
        const status = pavimentos[key].Status;

        // Se o Status for true, define a cor como verde
        if (status) {
          viewer1.setThemingColor(value.dbId, new THREE.Vector4(0, 1, 0, 1)); // Verde
        }
        // Caso contrário, você pode não alterar a cor ou aplicar lógica adicional
      });
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

getHistoricoFormas();