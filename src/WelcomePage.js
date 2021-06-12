import React from "react";
import {Button, Checkbox, Form, Input, notification} from "antd";
import './WelcomePage.css';
import {useSelector,useDispatch } from "react-redux";
import {
    setSeatsNumber,
    getFreeSeatsNumber,
    getMaxConsecutiveSeatsNumber,
} from "./cinemaSlice";

import {useHistory} from "react-router-dom";


export default function WelcomePage (){
    const history = useHistory();
    const dispatch = useDispatch();

    const freeSeatsNumber = useSelector(getFreeSeatsNumber);
    const maxConsecutiveSeatsNumber = useSelector(getMaxConsecutiveSeatsNumber);

    const onFinish = (values) => {
        if (!(values.numSeats > 0)) {
            notification.open({
                message: 'Proszę wybrać dodatnią liczbę miejsc!',
                description:
                    '',
            });
            return;
        }
        if (values.numSeats > freeSeatsNumber) {
            notification.open({
                message: 'Niewystarczająca liczba miejsc!',
                description:
                    'Na sali nie została wystarczająca liczba miejsc wolnych! ' +
                    'Liczba wolnych miejsc to '+freeSeatsNumber,
            });
            return;
        }


        if (values.nextToEachOther && values.numSeats > maxConsecutiveSeatsNumber) {
            notification.open({
                message: 'Niewystarczająca liczba miejsc!',
                description:
                    'Na sali nie została wystarczająca liczba miejsc wolnych, ' +
                    'które są obok siebie! Liczba takich miejsc to '+maxConsecutiveSeatsNumber,
            });
            return;
        }

        dispatch(setSeatsNumber({number:values.numSeats, continues: values.nextToEachOther}));
        history.push('/seats')
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
                >
                    <Input type="number" />
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

