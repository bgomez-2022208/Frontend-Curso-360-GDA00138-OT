import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import OperatorHome from './pages/Home/OperatorHome.jsx';
import Cart from "./components/Cart.jsx";
import ClientHome from "./pages/Home/ClientHome.jsx";
import UsuariosTable from "./pages/UsersCrud.jsx";
import ProductosTable from "./pages/ProductCrud.jsx";
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/home/cliente" element={<ClientHome />} />
                <Route path="/home/operador" element={<OperatorHome />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/usuarios" element={<UsuariosTable />} />
                <Route path="/productos" element={<ProductosTable />} />
            </Routes>
        </Router>
    );
};

export default App;
