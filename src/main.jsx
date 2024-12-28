import ReactDom from 'react-dom/client';
import Login from './pages/Login/Login.jsx';

const root = ReactDom.createRoot(document.getElementById('root'));

root.render(
    <div>
        <Login/>,
    </div>
);