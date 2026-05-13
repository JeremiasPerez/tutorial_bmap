import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function PaginaGrafico({ barriosData }) {
 
  const nombres = barriosData.features.map((b) => b.properties.TEXTO)

    const edadMedia = barriosData.features.map((b) => b.properties.edad_media ? b.properties.edad_media['2025'] : NaN)
  const data = {
    labels: nombres,
    datasets: [
      {
        label: 'Edad media',
        data: edadMedia,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: "500px" }}>
      <h2>Edad media por barrio</h2>
      <Bar data={data} options={options} />
    </div>
  );
}