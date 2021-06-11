import './Tile.css';

export default function Tile (props) {
    let reserved = props.reserved;
    let button = props.button;
    return(
        <div className={(reserved?reserved:"")+' square '} style={{
            border: "1px solid " +(reserved===""?"white":"#999")}}>
            {(button)? <button onClick={props.onClick} className={"selectable content " + reserved}/>:""}
        </div>
    )
}
