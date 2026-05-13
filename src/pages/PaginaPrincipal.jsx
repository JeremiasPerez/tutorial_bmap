
import { Link } from 'react-router-dom'

export default function PaginaPrincipal () {

    return (
        <div>
            <Link to="/mapa">Edad media por barrio</Link><br/>
            <Link to="/comercios">Peluquerías, panaderías y tiendas de ropa en Coronación</Link><br/>
            <Link to="/grafico">Renta personal por barrio</Link>
        </div>
    )
}