import React from "react";
import Inputfield from "./Components/Inputfield";
import { MessageCard } from "./Components/Userpromts";
import Navbar from "./Components/Navbar";

const Promt = () => {
    return (
        <>
            <Navbar />
            <MessageCard />
            <Inputfield />
        </>
    );
};

export default Promt;