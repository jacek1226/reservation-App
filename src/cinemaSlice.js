import { createSlice } from '@reduxjs/toolkit';
import data from "./db.json";

const initialState = {
    seatsArray: null,
    selected: [],
    seatsNumber: 0,
};

export const cinemaSlice = createSlice({
    name: 'cinema',
    initialState,
    reducers: {
        fetchSeatsData: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.seatsArray = renderSeats(data.seats);
        },
        switchSelectedSeats: (state, action)=> {
            let newSeatsArr = action.payload;
            newSeatsArr.forEach((seat)=>{
                let seatId = seat.id;
                let newChoice = [];
                if (state.selected.includes(seatId)) {
                    newChoice = state.selected.filter(choice => seatId !== choice.id);
                } else {
                    newChoice = state.selected.concat(seat);
                }
                state.selected = newChoice;
            })
        },
        setSeatsNumber: (state, action) => {
            state.seatsNumber = parseInt(action.payload);
        },
    },
});

export const { fetchSeatsData, switchSelectedSeats,  setSeatsNumber} = cinemaSlice.actions;

export const getSelected = (state) => state.cinema.selected;
export const getSeatsNumber = (state) => state.cinema.seatsNumber;
export const getSeatsArray = (state) => state.cinema.seatsArray;

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
            let tempRow = seatsArr[i].sort((seatL, seatR) => seatL.cords.y > seatR.cords.y);
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

