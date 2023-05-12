import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useLocation, useParams } from 'react-router-dom';
import { CardContext } from "../context/CardContext";
import Card from "../components/card/Card";

function CardPage() {
    const { setCardOpen } = useContext(CardContext);

    useEffect(() => {
        setCardOpen(true);
    });

    const location = useLocation();
    const { cat, uri } = useParams();
    console.log(cat, uri);
    return <Card />
}

export default CardPage;