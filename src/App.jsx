import { useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom'
import PaginaMapa from './pages/PaginaMapa'
import PaginaGrafico from './pages/PaginaGrafico'
import PaginaComercios from './pages/PaginaComercios'
import PaginaPrincipal from './pages/PaginaPrincipal'

import "./App.css";

export default function App() {
  const [barriosData, setBarriosData] = useState(null);
  const [comerciosData, setComercios] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      const [geojsonRes, comerciosRes] = await Promise.all([
        fetch("(/tutorial_bmap/barrios_con_datos.geojson"),
        fetch("/tutorial_bmap/comercios_clasificados.geojson")
      ]);
      const geojson = await geojsonRes.json();
      const comerciosD = await comerciosRes.json();
      setBarriosData(geojson);
      setComercios(comerciosD)
    }
    cargarDatos();
  }, []);

  if (!barriosData || !comerciosData ){
    return (
      <p>Cargando datos...</p>
    )
  }

  return (

      <HashRouter>
        <Routes>
          <Route path="/" element={<PaginaPrincipal barriosData={barriosData} comerciosData={comerciosData}></PaginaPrincipal>}></Route>
          <Route path="/mapa" element={<PaginaMapa barriosData={barriosData} ></PaginaMapa>}></Route>
          <Route path="/grafico" element={<PaginaGrafico barriosData={barriosData} ></PaginaGrafico>}></Route>
          <Route path="/comercios" element={<PaginaComercios barriosData={barriosData} comerciosData={comerciosData}></PaginaComercios>}></Route>
        </Routes>
      </HashRouter>
  )
}