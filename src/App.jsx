import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import ClientHome from './pages/Home/ClientHome.jsx';
import OperatorHome from './pages/Home/OperatorHome.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import Cart from "./pages/Cart.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home/client" element={<ClientHome />} />
                <Route path="/home/operator" element={<OperatorHome />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order-history" element={<OrderHistory />} />
            </Routes>
        </Router>
    );
};

export default App;
