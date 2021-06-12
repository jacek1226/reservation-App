import React from "react";
import Tile from "./Tile";
import {Button, Col, Row, notification} from "antd";
import {useSelector,useDispatch } from "react-redux";
import {
    switchSelectedSeats,
    getSelected,
    getSeatsNumber,
    getSeatsArray,
    getSeatsContinues,
} from "./cinemaSlice";
import {useHistory} from "react-router-dom";

export default function SeatsPage () {
    const dispatch = useDispatch();
    const history = useHistory();

    const seatsArray = useSelector(getSeatsArray);
    const seatsNumber = useSelector(getSeatsNumber);
    const seats = useSelector(getSelected)
    const choice =  seats.map((seat) => seat.id);
    const seatsContinues =  useSelector(getSeatsContinues);

    const chooseSeat= (seat)=>{
        if (seat !== null) {
            dispatch(switchSelectedSeats(seat))
        }
    }

    if (seatsArray===null){
        return (<div>
            "error"!
        </div>);
    }
    const areContinues=()=>{
        let continues = seats.map(seat => seat).reduce((prev,val)=>{
            if(prev.seat===null ||prev.seat.cords.x !== val.cords.x || prev.seat.cords.y !== (val.cords.y - 1)){
                return {seat:val, consecutive:1};
            }
            return {seat:val, consecutive: prev.consecutive +1}
        },{seat:null, consecutive: 0})

        return continues.consecutive ===seats.length;
    }

    const selectSeats = ()=>{


        if(choice.length !== seatsNumber) {
            notification.open({
                message: 'Wybrano niewłaściwą liczbę miejsc!',
                description:
                    'zadeklarowano: '+seatsNumber+", wybrano: "+choice.length,

            });
            return;
        }
        if(seatsContinues && !areContinues()) {
            notification.open({
                message: 'Wybrano złe miejsca!',
                description:
                    'Wybrane miejsca powinny być obok siebie, nieoddzielone wolną przestrzenią lub zajętym miejscem.',
            });
            return;
        }



        history.push('/return');

    }

    let cinema = [];
    for (let x = 0; x < seatsArray.length; x++) {
        let row = [];
        for (let y = 0; y < seatsArray[x].length; y++) {
            let seat = seatsArray[x][y];
            let choiceClass = "";
            if (seat !== null){
                choiceClass= seat.reserved?"reserved":"available";
                if (choice.includes(seat.id)){
                    choiceClass = "choice";
                }
            }
            let id = " "+x+" "+y
            row.push(
                <Tile reserved={choiceClass}
                      button={(choiceClass==="available" || choiceClass === "choice")}
                      onClick={()=>chooseSeat([seat])}
                      key={id}
                />
            );

        }
        cinema.push(
            <Row key={x}>
                <Col span={20} offset={2}>
                    <div className="seatRow">{row}</div>
                </Col>
            </Row>);
    }
    let footer=[];
    footer.push(
        <Row key={"bottom"} style={{display:"flex", alignItems:"center"}}>
            <Col span={2} offset={2}>
                <div className="seatRow">
                    <Tile reserved={"available"} button={false} />
                </div>
            </Col>
            <Col span={3} style={{textAlign:"center", height:"100%"}}>
                Miejsca dostępne
            </Col>

            <Col span={2}>
                <Tile reserved={"reserved"} button={false}/>
            </Col>
            <Col span={3} style={{textAlign:"center", height:"100%"}}>
                Miejsca zarezerwowane
            </Col>

            <Col span={2}>
                <Tile reserved={"choice"} button={false}/>
            </Col>
            <Col span={3} style={{textAlign:"center", height:"100%"}}>
                Twój wybór
            </Col>

            <Col span={5} style={{display:"flex", justifyContent:"center"}}>
                <Button type="default" htmlType="submit" onClick={selectSeats} style={{width:"100%", height:"100%"}}> "Rezerwuj"</Button>
            </Col>
        </Row>
    )

    cinema.push(footer);
    return (
        <div className="cinema">{cinema}</div>
    );

}
