import {CartIcon, ClearCartIcon, } from './icons.jsx'
import {useId} from "react";
import './Cart.css'

export default function Cart(){
    const cartCheckboxId = useId()
    return(
        <>
            <label className="cart-button" htmlFor={cartCheckboxId}>
                <CartIcon />
            </label>
            <input id={cartCheckboxId} type="checkbox" hidden/>
            <aside className="cart">
                <ul>
                    <li>
                        <img
                            src=''
                            alt='Iphone'
                        />
                        <div>
                            <strong>iPhone</strong> - $1499
                        </div>

                        <footer>
                            <small>
                                Qty: 1
                            </small>
                            <button>+</button>
                        </footer>
                    </li>
                </ul>
                <button>
                    <ClearCartIcon />
                </button>
            </aside>
        </>
    )
}