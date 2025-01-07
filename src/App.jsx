import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import OperatorHome from './pages/Home/OperatorHome.jsx';
import ClientHome from "./pages/Home/ClientHome.jsx";
import UsuariosTable from "./pages/UsersCrud.jsx";
import ProductosTable from "./pages/ProductCrud.jsx";
import {ProtectedFunctionAdmin, ProtectedRoute} from "./reutilizables/ProtectedRoute.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/home/cliente" element={<ProtectedRoute><ClientHome/></ProtectedRoute>} />
                <Route path="/home/operador" element={<ProtectedRoute><OperatorHome /></ProtectedRoute>} />
                <Route path="/usuarios" element={<ProtectedRoute><ProtectedFunctionAdmin><UsuariosTable /></ProtectedFunctionAdmin></ProtectedRoute>} />
                <Route path="/productos" element={<ProtectedRoute><ProtectedFunctionAdmin><ProductosTable /></ProtectedFunctionAdmin></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};
export default App;
