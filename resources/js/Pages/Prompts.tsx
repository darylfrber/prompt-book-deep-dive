import React from "react";
import { MessageCard } from "./Components/Userpromts";
import { Inputfield } from "./Components/Inputfield";
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