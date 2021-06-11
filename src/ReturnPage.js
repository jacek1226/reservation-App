import React from 'react';
import {useSelector} from "react-redux";
import {getSelected} from "./cinemaSlice";

export function ReturnPage(props) {

    const choice =  useSelector(getSelected);
    let reservedList = choice.map((seat)=>
        <li type="none" key={seat.id}>
            -rząd {seat.cords.x}, miejsce {seat.cords.y} ({seat.id})
        </li>)
    return(
        <div>
        <h1>Twoja rezerwacja przebiegła pomyślnie!</h1>
        <br/>
            Wybrałeś miejsca:
            <ul>
                {reservedList}
            </ul>
            <br/>
            <b>
                Dziękujemy! w razie problemów prosimy o kontakt z działem administracji.
            </b>
        </div>
    )
}
