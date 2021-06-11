import React, {useState} from "react";
import {Button, Checkbox, Form, Input} from "antd";
import './WelcomePage.css';
import {useDispatch } from 'react-redux';
import {setSeatsNumber } from "./cinemaSlice";

import {useHistory} from "react-router-dom";


export default function WelcomePage (props){
    const history = useHistory();
    const [count, setCount] = useState(0);
    const dispatch = useDispatch();

    const onFinish = (values) => {
        if (values.numSeats > 0) {
            dispatch(setSeatsNumber(values.numSeats));
            history.push('/seats')
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (

        <div className="center">
            <Form
                offset={8}
                span={8}
                name="Seats"
                initialValues={{
                    seats: 0,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className={"form"}
            >

                <Form.Item
                    labelCol={{span:12}}
                    wrapperCol={{span:12}}
                    name="numSeats"
                    label={"Liczba miejsc: "}
                    rules={[
                        {
                            required: true,
                            message: 'Proszę podać liczbę miejsc!',
                        },
                    ]}

                >
                    <Input type="number" onChange={(e)=>{
                        setCount(parseInt(e.target.value))

                    }} />
                </Form.Item>
                <Form.Item span={24} name="nextToEachOther" valuePropName="checked">
                    <Checkbox value={false}> Czy miejsca mają być obok siebie? </Checkbox>
                </Form.Item>

                <Form.Item span={24}>
                    <Button block={true} span={24} type="default" htmlType="submit"> Wybierz miejsca </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

