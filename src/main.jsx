import ReactDom from 'react-dom/client';
import App from "./App.jsx";
import React from "react";
import {StyledEngineProvider} from "@mui/joy";


const root = ReactDom.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <App />
        </StyledEngineProvider>
    </React.StrictMode>
);