import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register';
import ClientHome from './pages/Home/ClientHome';
import OperatorHome from './pages/Home/OperatorHome';
import Cart from './pages/Cart.jsx';
import OrderHistory from './pages/OrderHistory';

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