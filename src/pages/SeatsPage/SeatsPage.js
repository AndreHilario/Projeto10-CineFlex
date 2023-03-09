import styled from "styled-components";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function SeatsPage(props) {

    const { idSessao } = useParams();
    const { name, document, arraySeats, setName, setDocument, setArraySeats, infoSession, infoDay, infoTime, setInfoSession, setInfoDay, setInfoTime } = props;

    const [seats, setSeats] = useState([]);
    const [infosRequest, setInfosRequest] = useState([]);

    function selectSeat(id, index) {
        const selectedSeat = arraySeats.find(seat => seat.id === id);
        if (seats[index].isAvailable) {
            if (selectedSeat) {
                const newSeats = arraySeats.filter(seat => seat.id !== id);
                setArraySeats(newSeats);
            } else {
                const newSeats = [...arraySeats, { "id": id, "index": index }];
                setArraySeats(newSeats);
            }
        } else {
            messageAlert();
        }
    }

    function messageAlert() {
        alert("Esse assento não está disponível");
    }

    function sendRequest() {

        const allInfos = {
            ids: [arraySeats.index],
            name: name,
            document: document
        }

        axios
            .post("https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many", allInfos)
            .then((response) => {
                setInfosRequest(response)
            })
            .catch((err) => {
                console.log(err.response);
            });
    }

    useEffect(() => {
        axios
            .get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`)
            .then((response) => {
                setSeats(response.data.seats);
                setInfoSession(response.data.movie);
                setInfoTime(response.data);
                setInfoDay(response.data.day);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }, []);

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seats.map((seat, index) => {
                    const selectedSeat = arraySeats.find(selected => selected.id === seat.id);
                    const status = selectedSeat ? 2 : seat.isAvailable ? 1 : 0;
                    return (
                        <SeatItem
                            onClick={() => selectSeat(seat.id, index)}
                            status={status}
                            key={seat.id}
                        >
                            {seat.name}
                        </SeatItem>
                    );
                })}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle status={2} />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle status={1} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle status={0} />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer>
                Nome do Comprador:
                <input placeholder="Digite seu nome..." onChange={e => setName(e.target.value)} value={name} />

                CPF do Comprador:
                <input placeholder="Digite seu CPF..." onChange={event => setDocument(event.target.value)} value={document} />

                <Link to={"/sucesso"}>
                    <button onClick={() => sendRequest()}>Reservar Assento(s)</button>
                </Link>
            </FormContainer>

            <FooterContainer>
                <div>
                    <img src={infoSession.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{infoSession.title}</p>
                    <p>{infoDay.weekday} - {infoTime.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}


const colorsAndBorders = [
    {
        color: "#FBE192",
        border: "#F7C52B"
    },
    {
        color: "#C3CFD9",
        border: "#7B8B99"
    },
    {
        color: "#1AAE9E",
        border: "#0E7D71"
    }
];

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.div`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    a {
        align-self: center;
        display: flex;
        justify-content: center;
        text-decoration: none;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: ${(props) => colorsAndBorders[props.status].color};   
    background-color: ${(props) => colorsAndBorders[props.status].color};
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: ${(props) => colorsAndBorders[props.status].color};  
    background-color: ${(props) => colorsAndBorders[props.status].color};  
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`