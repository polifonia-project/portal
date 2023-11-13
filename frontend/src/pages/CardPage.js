import { useEffect, useContext, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { CardContext } from "../context/CardContext";
import Card from "../components/card/Card";

function CardPage(props) {
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title');
  const cat = searchParams.get('cat');
  const uri = searchParams.get('uri');
  const input = searchParams.get('input');
  const hasinput = searchParams.get('hasinput');
  const [withInput, setWithInput] = useState(false);

  const { setCardOpen } = useContext(CardContext);
  const { setCardContent } = useContext(CardContext);
  const { setCardBlocksNew } = useContext(CardContext);

  // When the user first comes here from general search route, 


  useEffect(() => {
    setCardOpen(true);
  }, [setCardOpen]);

  useEffect(() => {
    if (hasinput === 'false') { setWithInput(false) } else { setWithInput(true) }
    props.func('Portal');
    setCardContent({ title: title, cat: cat, input: input, uri: uri, color: '#000000', hasInput: withInput, goesBack: false })
  }, [cat, setCardContent, title, uri, input, hasinput, searchParams, withInput]);

  useEffect(() => {
    fetch("/portal/conf_info")
      .then(res => res.json())
      .then(data => setCardBlocksNew(data.cards))
  }, [setCardBlocksNew]);

  return (
    <Card></Card>
  )
}

export default CardPage;