import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    seatsArray: null,
    selected: [],
    seatsNumber: 0,
    continues: false,
};

export function fetchSeatsData(){
    return (dispatch) =>{
        return axios.get('http://localhost:8000/seats')
            .then(function (response) {
                dispatch(receiveData(response.data));
                return response.data;
                //dispatch action
            })
            .catch(function (error) {
                console.log(error);
                return error;

                // throw error
                //
            });
    }
}

export const cinemaSlice = createSlice({
    name: 'cinema',
    initialState,
    reducers: {

        receiveData: (state,action)=>{
            state.seatsArray = renderSeats(action.payload);
        },
        switchSelectedSeats: (state, action)=> {
            let newSeatsArr = action.payload;
            let selected = state.selected.map(seat => seat.id);
            newSeatsArr.forEach((seat)=>{
                let seatId = seat.id;

                if (selected.includes(seatId)) {
                    state.selected = state.selected.filter(choice => seatId !== choice.id);
                }
                else {
                    let newArray = state.selected.concat(seat).map(seat=>seat);
                    state.selected = newArray.sort(
                        function (seatL, seatR) {
                            if (seatL.cords.x !== seatR.cords.x)
                                return (seatL.cords.x > seatR.cords.x)?1:-1;
                            return (seatL.cords.y > seatR.cords.y)?1:-1;
                        });
                }
            })
        },
        setSeatsNumber: (state, action) => {

            let number = parseInt(action.payload.number);
            let continues = (action.payload.continues===undefined)?false:action.payload.continues;
            state.seatsNumber = number;
            state.continues = continues;
            state.selected =[];
            let seats = 0;
            if (!continues){
                state.seatsArray.map(seatRow => seatRow.reduce((prev, val)=>{
                    if (val == null || val.reserved){
                        return prev;
                    }
                    if(seats < number) {
                        state.selected = state.selected.concat(val);
                        seats+=1;
                    }
                    return prev+1;
                }, 0)).reduce((prev,val) => prev+val,0);
            }
            else{
                let cords={x:null,y:null};
                state.seatsArray.forEach(seatRow => seatRow.reduce((prev,val)=>{
                    if (val===null || val.reserved){
                        return {seat:val, consecutive:0};
                    }
                    if (prev.consecutive+1 === number){
                        cords=val.cords;
                    }

                    return {seat:val, consecutive: prev.consecutive +1}

                },{seat:null, consecutive: 0}).consecutive);
                for (let i=number-1;i>=0;i-=1){
                    state.selected = state.selected.concat(state.seatsArray[cords.x][cords.y-i]);
                }
            }
            switchSelectedSeats(state,seats);
        }
    },
});

export const {switchSelectedSeats,  setSeatsNumber, receiveData} = cinemaSlice.actions;

export const getSelected = (state) => state.selected;
export const getSeatsNumber = (state) => state.seatsNumber;
export const getSeatsArray = (state) => state.seatsArray;
export const getSeatsContinues = (state) => state.continues;
export const getFreeSeatsNumber = (state) => {
    if (state.seatsArray==null){
        return 0;
    }
    return state.seatsArray.map(seatRow => seatRow.reduce((prev, val)=>{
        if (val == null || val.reserved){
            return prev;
        }
        return prev+1;
    }, 0)).reduce((prev,val) => prev+val,0);
};

export const getMaxConsecutiveSeatsNumber = (state) =>{
    if (state.seatsArray==null){
        return 0;
    }
    let maxy = 0;
    state.seatsArray.map(seatRow => seatRow.reduce((prev,val)=>{
        if (val===null || val.reserved){
            return {seat:val, consecutive:0};
        }
        if (prev.consecutive===maxy){
            maxy = prev.consecutive+1;
        }

        return {seat:val, consecutive: prev.consecutive +1}

    },{seat:null, consecutive: 0}).consecutive);

    return maxy;
}

export default cinemaSlice.reducer;


function renderSeats(seatsData) {
    //sorting seats into rows
    let seatsArr = [];
    let xArr = [];
    let yArr = [];
    let xMax = null;
    let yMax = null;

    seatsData.forEach((val) => {
        let x = val.cords.x;
        let y = val.cords.y;
        if (!(xArr.includes(x))) {
            seatsArr[x] = [];
            xArr = [...xArr, x];
            if (xMax === null || x > xMax) {
                xMax = x;
            }
        }
        if (!(yArr.includes(y))) {
            yArr = [...yArr, y];
            if (yMax === null || y > yMax) {
                yMax = y;
            }
        }
        seatsArr[x] = [...seatsArr[x], val];
    })
    //create empty row

    let emptyRow = []

    for (let i = 0; i <= yMax; i++) {
        emptyRow = [...emptyRow, null];
    }

    //sorting seats in order
    for (let i = 0; i <= xMax; i++) {
        let newRow = [];
        if (!(seatsArr[i])) {
            newRow = [...emptyRow];
        } else {
            let tempRow = seatsArr[i].sort((seatL, seatR) => (seatL.cords.y > seatR.cords.y)?1:-1);
            let idx = 0;
            for (let i = 0; i <= yMax; i++) {
                let newElem = null;
                if (tempRow[idx] !== undefined && tempRow[idx].cords.y === i) {
                    newElem = tempRow[idx];
                    idx += 1;
                }
                newRow[i] = newElem
            }
        }
        seatsArr[i] = newRow;
    }
    return seatsArr;
}

