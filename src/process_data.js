

// población + población por rango de edad (por año) -> De2.xlsx -> V

// # viviendas + m2 promedio + valor catastral promedio (por año) -> Terr2.xlsx -> V

// # vehículos por año -> Movi2.xlsx -> V

// renta personal media por año -> rpf... -> V

// renta familiar media por año -> rpf_rp28 -> V

// edad media por barrio -> https://public.tableau.com/app/profile/gasteizko.udala.ayuntamiento.de.vitoria/viz/Demografa_estructuraydinmica_16539919851600/AurkezpenaPresentacin

// superficie -> T2.xlsx -> V

import fs from "fs";

import * as XLSX from 'xlsx/xlsx.mjs';

/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from 'stream';
XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable(cpexcel);



const barrios = JSON.parse(
  fs.readFileSync("../public/data/barrios.geojson", "utf8")
);


const getCellValue = (sheet, col, row) => {
    if (sheet[col+row] != null) return sheet[col+row].v
    const cols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const colN = cols.indexOf(col)
    const rowN = row - 1
    const me = sheet['!merges']?.find((m) => {
        return m.s.c <= colN && m.e.c >= colN && m.s.r <= rowN && m.e.r >= rowN
    })
    if (me == null) return null
    const coords = cols.charAt(me.s.c) + (me.s.r+1)
    return sheet[coords].v
}


const processDemographyXlsx = (barrios) => {
    const workbook = XLSX.readFile("../public/data/De2.xlsx");
    const sheet = workbook.Sheets['Sheet 1']
    const barrioIdRegexp = /\d\d/
    
    for(let i=1;i<=2295;i++){
        const year = getCellValue(sheet, 'A',i)
        const barrioCell = getCellValue(sheet, 'C',i)

        if (!barrioIdRegexp.test(barrioCell)) continue
        const barrioId = parseInt(barrioCell.match(barrioIdRegexp)[0])

        const b = barrios.features.find((ba) => ba.properties.BARRIO == barrioId)
        if (b == null) continue;

        // buscar barrio por ID y si no se encuentra, continue
        const rangoCell = getCellValue(sheet, 'D',i)
        const totalCell = getCellValue(sheet,'F',i)
        const hombresCell = getCellValue(sheet,'G',i)
        const mujeresCell = getCellValue(sheet,'H',i)

        if (b.properties.poblacionPorRango == null) b.properties.poblacionPorRango = {}
        if (b.properties.poblacionPorRango[year] == null) b.properties.poblacionPorRango[year] = {}
        b.properties.poblacionPorRango[year][rangoCell] = {total: Number(totalCell), hombres: Number(hombresCell), mujeres: Number(mujeresCell)}
    }
}

const processHomesXlsx = (barrios) => {
    const workbook = XLSX.readFile("../public/data/Terr2.xlsx");
    const sheet = workbook.Sheets['Sheet 1']
    const barrioIdRegexp = /\d\d/
    
    for(let i=1;i<=769;i++){
        const year = getCellValue(sheet, 'A',i)
        const barrioCell = getCellValue(sheet, 'D',i)

        if (!barrioIdRegexp.test(barrioCell)) continue
        const barrioId = parseInt(barrioCell.match(barrioIdRegexp)[0])

        const b = barrios.features.find((ba) => ba.properties.BARRIO == barrioId)
        if (b == null) continue;

        // buscar barrio por ID y si no se encuentra, continue
        const indicadorCell = getCellValue(sheet, 'C',i)
        const amountCell = getCellValue(sheet,'E',i)

        if (b.properties.vivienda == null) b.properties.vivienda = {cantidad: {}, superficie: {}, valor_catastral: {}}
        if (indicadorCell.includes('Número de viviendas')) b.properties.vivienda.cantidad[year] = Number(amountCell)
        else if (indicadorCell.includes('Promedio superficie')) b.properties.vivienda.superficie[year] = Number(amountCell)
        else if (indicadorCell.includes('Promedio valor')) b.properties.vivienda.valor_catastral[year] = Number(amountCell)
    }
}

const processVehicuosXlsx = (barrios) => {
    const workbook = XLSX.readFile("../public/data/Movi2.xlsx");
    const sheet = workbook.Sheets['Sheet 1']
    const barrioIdRegexp = /\d\d/
    
    for(let i=1;i<=769;i++){
        const year = getCellValue(sheet, 'A',i)
        const barrioCell = getCellValue(sheet, 'C',i)

        if (!barrioIdRegexp.test(barrioCell)) continue
        const barrioId = parseInt(barrioCell.match(barrioIdRegexp)[0])

        const b = barrios.features.find((ba) => ba.properties.BARRIO == barrioId)
        if (b == null) continue;

        // buscar barrio por ID y si no se encuentra, continue
        const amountCell = getCellValue(sheet,'D',i)

        if (b.properties.vehiculos == null) b.properties.vehiculos = {}
        b.properties.vehiculos[year] = Number(amountCell)
    }
}

const processRentaPersonalXlsx = (barrios) => {
    const workbook = XLSX.readFile("../public/data/renta_personal.xlsx");
    const sheet = workbook.Sheets['rpf_rp22_2p']
    const barrioIdRegexp = /\d\d/
    const cols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    const normalizeText = (t) => {
        return t.toLowerCase().replace('vitoria','').trim().replace(/[\s\-]/,'').replace(/á/gi,'a').replace(/é/gi,'e').replace(/í/gi,'i').replace(/ó/gi,'o').replace(/ú/gi,'u')
    }
    for(let i=11;i<=221;i=i+7){
        const barrioCell = getCellValue(sheet, 'A',i)
        const b = barrios.features.find((ba) => normalizeText(ba.properties.TEXTO) == normalizeText(barrioCell))
        if (b == null){
            console.log(barrioCell+' not found')
            continue
        }

        if (b.properties.renta == null) b.properties.renta = {personal: {}, familiar: {}}

        for(let j=3;j<=16;j++){
            const year = getCellValue(sheet, cols.charAt(j-1),3)
            const amountCell = getCellValue(sheet, cols.charAt(j-1), i)
            b.properties.renta.personal[year] = Number(amountCell)
        }

    }
}

const processRentaFamiliarlXlsx = (barrios) => {
    const workbook = XLSX.readFile("../public/data/renta_familiar.xlsx");
    const sheet = workbook.Sheets['rpf_rf28_2f']
    const barrioIdRegexp = /\d\d/
    const cols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    const normalizeText = (t) => {
        if (t == null) return null
        return t.toLowerCase().replace('vitoria','').trim().replace(/[\s\-]/,'').replace(/á/gi,'a').replace(/é/gi,'e').replace(/í/gi,'i').replace(/ó/gi,'o').replace(/ú/gi,'u')
    }
    for(let i=5;i<=35;i++){
        const barrioCell = getCellValue(sheet, 'A',i)
        const b = barrios.features.find((ba) => normalizeText(ba.properties.TEXTO) == normalizeText(barrioCell))
        if (b == null){
            console.log(barrioCell+' not found')
            continue
        }

        if (b.properties.renta == null) b.properties.renta = {personal: {}, familiar: {}}

        for(let j=3;j<=16;j++){
            const year = getCellValue(sheet, cols.charAt(j-1),3)
            const amountCell = getCellValue(sheet, cols.charAt(j-1), i)
            b.properties.renta.familiar[year] = Number(amountCell)
        }

    }
}

const processSuperficieXlsx = (barrios) => {
    const workbook = XLSX.readFile("../public/data/T2.xlsx");
    const sheet = workbook.Sheets['Sheet 1']
    const barrioIdRegexp = /\d\d/
    const cols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for(let i=2;i<=32;i++){
        const barrioCell = getCellValue(sheet, 'A',i)
        if (!barrioIdRegexp.test(barrioCell)) continue
        const barrioId = parseInt(barrioCell.match(barrioIdRegexp)[0])


        const b = barrios.features.find((ba) => ba.properties.BARRIO == barrioId)
        if (b == null){
            console.log(barrioCell+' not found')
            continue
        }

        const amountCell = getCellValue(sheet, 'D', i)
        b.properties.superficie = Number(amountCell)
    }
}

const nuevosBarrios = {...barrios}
processDemographyXlsx(nuevosBarrios)
processHomesXlsx(nuevosBarrios)
processVehicuosXlsx(nuevosBarrios)
processRentaPersonalXlsx(nuevosBarrios)
processRentaFamiliarlXlsx(nuevosBarrios)
processSuperficieXlsx(nuevosBarrios)
nuevosBarrios.features.forEach((b) => {
    delete b.properties['OBJECTID']
    delete b.properties['SHAPE__ST_AREA__']
    delete b.properties['SHAPE__SDELENGTH__']
    delete b.properties['DB2GSE.ST_Area(SHAPE)']
    delete b.properties['DB2GSE.SdeLength(SHAPE)']
})
console.log(nuevosBarrios.features[2].properties)

/*
fs.writeFileSync(
  "./public/data/barrios_con_datos.geojson",
  JSON.stringify(nuevosBarrios, null, 2),
  "utf8"
);

console.log("GeoJSON generado correctamente");
*/