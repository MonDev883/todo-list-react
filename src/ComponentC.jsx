import React, {useContext} from "react";
import { UserContext } from "./ComponentA.jsx";
import ComponentD from "./ComponentD.jsx"

function componentC(){

    const user = useContext(UserContext);

    return(<div className="box">
                <h1>ComponentC</h1>
                <h2>{`Hi ${user}`}</h2>
                <ComponentD />

           </div>);
}
export default componentC