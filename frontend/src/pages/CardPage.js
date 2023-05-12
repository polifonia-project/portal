import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useSearchParams } from 'react-router-dom';
import { CardContext } from "../context/CardContext";
import Card from "../components/card/Card";

function CardPage() {
    // try with http://localhost:3000/card?title=mozart&cat=people&uri=wikidata
    let [searchParams, setSearchParams] = useSearchParams()
    const title = searchParams.get('title')
    const cat = searchParams.get('cat')
    const uri = searchParams.get('uri')
    console.log(title, cat, uri)

    const { setCardOpen } = useContext(CardContext);
    const { setCardContent } = useContext(CardContext);

    useEffect(() => {

        setCardOpen(true);
        setCardContent({ title: title, cat: cat, uri: uri })
    }, []);

    return <Card />
}

export default CardPage;