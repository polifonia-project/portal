import { useEffect, useContext } from "react";
import { useSearchParams } from 'react-router-dom';
import { CardContext } from "../context/CardContext";

function CardPage(props) {

    // try with http://localhost:3000/card?title=Wolfgang%20Amadeus%20Mozart&cat=people&uri=wikidata
    let [searchParams] = useSearchParams()
    const title = searchParams.get('title');
    const cat = searchParams.get('cat');
    const uri = searchParams.get('uri');

    const { setCardOpen } = useContext(CardContext);
    const { setCardContent } = useContext(CardContext);
    const { setCardBlocksNew } = useContext(CardContext);

    useEffect(() => {
        props.func('Portal');
        setCardOpen(true);
        setCardContent({ title: title, cat: cat, input: 'no input', uri: uri, color: '#000000', hasInput: true, goesBack: false })
    }, [cat, props, setCardContent, setCardOpen, title, uri]);

    useEffect(() => {
        fetch("/portal/conf_info")
            .then(res => res.json())
            .then(data => setCardBlocksNew(data.cards))
    }, [setCardBlocksNew]);

}

export default CardPage;