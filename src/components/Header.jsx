import "./Header.css";
import PropTypes from "prop-types";

export default function Header({ title }) {
    return (
        <header className="Header">
            <h1 className="Header-title">{title}</h1>
        </header>
    );
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
};